import { odinFormat, validatePrincipalId } from '../odin/odinFormat';
import { getActor } from '../actor';

export const transferToken = async (odinData, to, tokenId, amount) => {
  try {
    if (!validatePrincipalId(to)) {
      throw new Error(
        'Invalid Principal ID format. Use the format: xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxx'
      );
    }

    const actor = await getActor(odinData);

    const formattedAmount = odinFormat(amount);

    const amountWithoutDecimal = formattedAmount.replace('.', '');
    const amountBigInt = BigInt(amountWithoutDecimal);

    const result = await actor.token_transfer({
      to: to,
      tokenid: tokenId,
      amount: amountBigInt
    });

    if (typeof result === 'object') {
      if ('ok' in result) {
        return {
          success: true,
          message: 'Transfer successful'
        };
      }
      if ('err' in result) {
        throw new Error(result.err || 'Error during transfer');
      }
    }

    return {
      success: true,
      message: 'Transfer successful'
    };
  } catch (error) {
    console.error('Error during transfer:', error);
    throw error;
  }
};
