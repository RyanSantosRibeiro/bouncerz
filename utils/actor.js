import { HttpAgent, Actor } from '@dfinity/agent';
import { Ed25519KeyIdentity, DelegationIdentity, DelegationChain } from '@dfinity/identity';

const idlFactory = ({ IDL }) => {
    const TokenAmount = IDL.Nat;
    
    const Amount = IDL.Variant({
        btc: TokenAmount,
        token: TokenAmount
    });

    return IDL.Service({
        'token_trade': IDL.Func([
            IDL.Record({
                typeof: IDL.Variant({
                    buy: IDL.Null,
                    sell: IDL.Null
                }),
                tokenid: IDL.Text,
                amount: Amount,
                settings: IDL.Opt(IDL.Record({
                    slippage: IDL.Opt(IDL.Tuple(IDL.Nat, IDL.Nat))
                }))
            })
        ], [
            IDL.Variant({
                ok: IDL.Opt(IDL.Text),
                err: IDL.Opt(IDL.Text)
            })
        ], []),
        'token_transfer': IDL.Func([
            IDL.Record({
                to: IDL.Text,
                tokenid: IDL.Text,
                amount: IDL.Nat
            })
        ], [
            IDL.Variant({
                ok: IDL.Null,
                err: IDL.Text
            })
        ], []),
        'get_transactions': IDL.Func([], [IDL.Vec(IDL.Record({
            from: IDL.Text,
            to: IDL.Text,
            amount: IDL.Nat,
            timestamp: IDL.Nat,
            type: IDL.Text
        }))], ['query']),
        'get_balance': IDL.Func([IDL.Text], [IDL.Nat], ['query'])
    });
};

let actorInstance = null;

const createIdentity = async (odinData) => {
    try {
        if (!odinData.delegationChain || !odinData.sessionIdentity) {
            throw new Error('Identity data not found in localStorage');
        }

        const publicKeyHex = odinData.sessionIdentity[0].slice(-64);
        const privateKeyHex = odinData.sessionIdentity[0];

        const privateKeyBytes = Buffer.from(privateKeyHex, "hex");
        const publicKeyBytes = Buffer.from(publicKeyHex, "hex");
        
        const sessionIdentity = Ed25519KeyIdentity.fromKeyPair(publicKeyBytes, privateKeyBytes);

        const restructuredDelegationChain = {
            delegations: odinData.delegationChain.delegations.map(del => ({
                delegation: {
                    expiration: del.delegation.expiration,
                    pubkey: del.delegation.pubkey,
                },
                signature: del.signature
            })),
            publicKey: odinData.delegationChain.publicKey
        };
        
        const delegationChain = DelegationChain.fromJSON(JSON.stringify(restructuredDelegationChain));
        const identity = DelegationIdentity.fromDelegation(sessionIdentity, delegationChain);

        return identity;
    } catch (error) {
        throw error;
    }
};

export const createActor = async (odinData) => {
    try {
        const identity = await createIdentity(odinData);

        const agent = new HttpAgent({
            host: 'https://icp0.io',
            identity: identity
        });

        await agent.fetchRootKey();

        const actor = Actor.createActor(idlFactory, {
            agent,
            canisterId: "z2vm5-gaaaa-aaaaj-azw6q-cai"
        });
        
        actorInstance = actor;
        return actor;
    } catch (error) {
        throw error;
    }
};

export const getActor = async (odinData) => {
    if (!actorInstance) {
        return await createActor(odinData);
    }
    return actorInstance;
};

export const resetActor = () => {
    actorInstance = null;
}; 