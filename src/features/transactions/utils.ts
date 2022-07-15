import { CurrencyAmount, NativeCurrency } from '@uniswap/sdk-core'
import { providers } from 'ethers'
import { TFunction } from 'i18next'
import { ChainId } from 'src/constants/chains'
import { TransactionDetails, TransactionType } from 'src/features/transactions/types'

export function getSerializableTransactionRequest(
  request: providers.TransactionRequest,
  chainId?: ChainId
): providers.TransactionRequest {
  // prettier-ignore
  const { to, from, nonce, gasLimit, gasPrice, data, value, maxPriorityFeePerGas, maxFeePerGas, type } = request
  // Manually restructure the txParams to ensure values going into store are serializable
  return {
    chainId,
    type,
    to,
    from,
    nonce: nonce ? parseInt(nonce.toString(), 10) : undefined,
    gasLimit: gasLimit?.toString(),
    gasPrice: gasPrice?.toString(),
    data: data?.toString(),
    value: value?.toString(),
    maxPriorityFeePerGas: maxPriorityFeePerGas?.toString(),
    maxFeePerGas: maxFeePerGas?.toString(),
  }
}

export function getNotificationName(transaction: TransactionDetails, t: TFunction) {
  switch (transaction.typeInfo.type) {
    case TransactionType.Approve:
      return t('Approve')
    case TransactionType.Swap:
      return t('Swap')
    case TransactionType.Wrap:
      return transaction.typeInfo.unwrapped ? t('Unwrapped') : t('Wrap')
  }

  return t('Transaction')
}

function getNativeCurrencyTotalSpend(
  value?: CurrencyAmount<NativeCurrency>,
  gasFee?: string,
  nativeCurrency?: NativeCurrency
): Nullable<CurrencyAmount<NativeCurrency>> {
  if (!gasFee || !nativeCurrency) return value

  const gasFeeAmount = CurrencyAmount.fromRawAmount(nativeCurrency, gasFee)
  return value ? gasFeeAmount.add(value) : gasFeeAmount
}

export function hasSufficientFundsIncludingGas(params: {
  transactionAmount?: CurrencyAmount<NativeCurrency>
  gasFee?: string
  nativeCurrencyBalance?: CurrencyAmount<NativeCurrency>
}) {
  const { transactionAmount, gasFee, nativeCurrencyBalance } = params
  const totalSpend = getNativeCurrencyTotalSpend(
    transactionAmount,
    gasFee,
    nativeCurrencyBalance?.currency
  )
  return !totalSpend || !nativeCurrencyBalance?.lessThan(totalSpend)
}
