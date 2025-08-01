import { Actor, HttpAgent } from '@dfinity/agent';
import { wallet } from '../odin/idlFactory';

const canisterIds = {
  siwbCanisterId: 'bcxqa-kqaaa-aaaak-qotba-cai',
  fastbtcCanisterId: 'ztwhb-qiaaa-aaaaj-azw7a-cai',
  ckbtcLedgerCanisterId: 'mxzaz-hqaaa-aaaar-qaada-cai',
  ckbtcMinterCanisterId: 'mqygn-kiaaa-aaaar-qaadq-cai',
  voltCanisterId: 'aclt4-uaaaa-aaaak-qb4zq-cai'
};

import {
  Ed25519KeyIdentity,
  Delegation,
  DelegationChain,
  DelegationIdentity
} from '@dfinity/identity';

export const login = async (address, signature, publicKey, walletType) => {
  try {
    console.log('Data received:', {
      address,
      signature,
      publicKey,
      walletType
    });

    console.log('\n=== Creating Base Identity ===');
    const generatedIdentity = Ed25519KeyIdentity.generate();
    const identityPublicKey = generatedIdentity.getPublicKey().toDer();
    console.log('1. Generated Identity:');

    const anonimousAgent = new HttpAgent({
      host: 'https://ic0.app',
      identity: Ed25519KeyIdentity.generate()
    });
    await anonimousAgent.fetchRootKey();

    console.log('1. Configuring actor...');
    console.log('   - Canister ID:', canisterIds.siwbCanisterId);
    console.log('   - Host:', 'https://ic0.app');

    const anonimousActor = Actor.createActor(wallet, {
      agent: anonimousAgent,
      canisterId: canisterIds.siwbCanisterId
    });
    console.log('2. Actor initialized successfully');

    console.log('\n=== Initializing Login ===');

    console.log('Usando fluxo normal de autenticação');

    console.log('2. Calling siwb_login...');
    // console.log(
    //   'lResult Signature:' +
    //     signature +
    //     ' ' +
    //     'Address:' +
    //     address +
    //     ' ' +
    //     'PublicKey:' +
    //     publicKey +
    //     ' ' +
    //     'IdentityPublicKey:' +
    //     identityPublicKey +
    //     ' ' +
    //     'WalletType:' +
    //     walletType
    // );

    const loginResult = await anonimousActor.siwb_login(
      signature,
      address,
      publicKey,
      new Uint8Array(identityPublicKey),
      walletType === 'phantom' ? { Bip322Simple: null } : { ECDSA: null }
    );

    const serializeBigInt = (obj) => {
      return JSON.stringify(
        obj,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value),
        2
      );
    };

    // console.log('Raw login result:', serializeBigInt(loginResult));

    if (!loginResult.Ok) {
      throw new Error(`Login failed: ${serializeBigInt(loginResult)}`);
    }

    const loginResultFormatted = {
      Ok: {
        user_canister_pubkey: Buffer.from(
          Object.values(loginResult.Ok.user_canister_pubkey)
        ).toString('hex'),
        expiration: new Date(
          Number(loginResult.Ok.expiration) / 1000000
        ).toLocaleString()
      }
    };

    // console.log(
    //   'Login result formatted:',
    //   serializeBigInt(loginResultFormatted)
    // );

    // console.log('Login Success:');
    // console.log('===========================');
    // console.log(
    //   'User Canister Pubkey (raw):',
    //   loginResult.Ok.user_canister_pubkey
    // );
    // console.log(
    //   'User Canister Pubkey (hex):',
    //   Buffer.from(loginResult.Ok.user_canister_pubkey).toString('hex')
    // );
    // console.log('Expiration:', loginResult.Ok.expiration.toString());
    // console.log('===========================\n');

    // console.log('\n=== Obtaining Delegation ===');
    // console.log('1. Calling siwb_get_delegation...');
    // console.log('   - Address:', address);
    // console.log(
    //   '   - Identity Public Key (DER):',
    //   Buffer.from(identityPublicKey).toString('hex')
    // );
    // console.log('   - Expiration:', loginResult.Ok.expiration.toString());

    const delegation = await anonimousActor.siwb_get_delegation(
      address,
      new Uint8Array(identityPublicKey),
      loginResult.Ok.expiration
    );

    if (!delegation.Ok) {
      throw new Error(
        `Falha ao obter delegação: ${serializeBigInt(delegation)}`
      );
    }

    function createDelegationChain(delegation, userCanisterPubkey) {
      const signatureBytes = new Uint8Array(
        Object.values(delegation.signature)
      );
      const pubkeyBytes = new Uint8Array(identityPublicKey);

      const delegations = [
        {
          delegation: new Delegation(
            pubkeyBytes,
            delegation.delegation.expiration,
            delegation.delegation.targets
          ),
          signature: signatureBytes
        }
      ];

      console.log('Usando userCanisterPubkey para outras wallets');
      return DelegationChain.fromDelegations(
        delegations,
        new Uint8Array(Object.values(userCanisterPubkey))
      );
    }

    const delegationChain = createDelegationChain(
      delegation.Ok,
      loginResult.Ok.user_canister_pubkey
    );

    console.log('\n=== Reconstruindo Identidade Final ===');
    const sessionIdentityJson = generatedIdentity.toJSON();
    const delegationChainJson = delegationChain.toJSON();

    const delegationPubkeyHex = Buffer.from(
      Object.values(delegation.Ok.delegation.pubkey)
    ).toString('hex');
    const publicKeyHex = delegationPubkeyHex.slice(-64);
    const privateKeyHex = sessionIdentityJson[1];

    const privateKeyBytes = Buffer.from(privateKeyHex, 'hex');
    const publicKeyBytes = Buffer.from(publicKeyHex, 'hex');

    const sessionIdentity = Ed25519KeyIdentity.fromKeyPair(
      publicKeyBytes,
      privateKeyBytes
    );

    const finalDelegationChain = DelegationChain.fromJSON({
      delegations: delegationChainJson.delegations,
      publicKey: Buffer.from(loginResult.Ok.user_canister_pubkey).toString(
        'hex'
      )
    });

    const identity = DelegationIdentity.fromDelegation(
      sessionIdentity,
      finalDelegationChain
    );
    console.log('5. Delegation Identity created successfully');
    console.log('   - User Principal:', identity.getPrincipal().toText());

    const timestamp = Date.now().toString();

    const signatureBuffer = await identity.sign(Buffer.from(timestamp));
    const odinSignature = Buffer.from(signatureBuffer).toString('base64');

    console.log('\n=== Authenticating on Odin ===');
    try {
      const odinAuthData = {
        delegation: JSON.stringify(delegationChainJson),
        timestamp: timestamp,
        signature: odinSignature,
        referrer: '2',
        principal: identity.getPrincipal().toText()
      };

      console.log('1. Sending request to Odin Auth...');
      console.log('Auth Data:', {
        principal: identity.getPrincipal().toText(),
        timestamp: timestamp,
        signature: odinSignature
      });

      const odinAuthResponse = await fetch('https://api.odin.fun/v1/auth', {
        method: 'post',
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          origin: 'https://odin.fun',
          pragma: 'no-cache',
          priority: 'u=1, i',
          referer: 'https://odin.fun/',
          'sec-ch-ua':
            '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        },
        body: JSON.stringify(odinAuthData)
      });

      const odinAuthResult = await odinAuthResponse.json();
      console.log('2. Odin Auth response:', odinAuthResult);

      return {
        data: {
          userPrincipal: identity.getPrincipal().toText(),
          publicKey: publicKeyHex,
          privateKey: privateKeyHex,
          delegationChain: delegationChain,
          sessionIdentity: [sessionIdentityJson[1], sessionIdentityJson[0]]
        }
      };
    } catch (error) {
      console.error('Error authenticating on Odin:', error);
      throw new Error('Error authenticating on Odin: ' + error.message);
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
