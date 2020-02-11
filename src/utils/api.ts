import axios from 'axios';
import { IMessageTransaction, ITransactionData, IPostTransactionResponse } from '../interfaces';

const path = (endpoint: string): string => process.env.REACT_APP_NODE + '/api' + endpoint;

const messageTypes = {
  type: process.env.REACT_APP_MESSAGE_TRANSACTION_TYPE,
  typeGroup: process.env.REACT_APP_MESSAGE_TRANSACTION_TYPE_GROUP
};

export const checkAccountExists = async (id: string): Promise<boolean> => {
  const hits = await axios
    .get(path('/delegates/' + id))
    .then(res => Object.keys(res.data.data).length)
    .catch(err => 0);

  return hits > 0;
};

export const getTransactions = async (channel: string): Promise<IMessageTransaction[]> => {
  const res = await axios.post(path('/transactions/search'), {
    ...messageTypes,
    recipientId: channel
  });

  return res.data.data;
};

export const getLastMessage = async (channel: string): Promise<IMessageTransaction> => {
  const res = await axios.post(path('/transactions/search'), {
    ...messageTypes,
    recipientId: channel
  });

  return res.data.data[0];
};

export const fetchUsername = async (address: string): Promise<string | null> => {
  const username = await axios
    .get(path('/delegates/' + address))
    .then(res => {
      return res ? res.data.data.username : null;
    })
    .catch(() => null);

  return username;
};

export const fetchTotalMessages = async (): Promise<number> => {
  const res = await axios.post(path('/transactions/search'), messageTypes);

  return res.data.meta.totalCount;
};

export const fetchTotalUserMessages = async (address: string): Promise<number> => {
  const res = await axios.post(path('/transactions/search'), {
    ...messageTypes,
    senderId: address
  });

  return res.data.meta.totalCount;
};

export const fetchTotalUsers = async (): Promise<number> => {
  const res = await axios.get(path('/delegates'));
  const numOfDelegates = Number(process.env.REACT_APP_DELEGATES);
  return res.data.meta.totalCount - numOfDelegates;
};

export const fetchRemoteNonce = async (address: string): Promise<string> => {
  let nonce;

  try {
    nonce = await axios
      .get(path(`/v2/wallets/${address}`))
      .then(res => parseInt(res.data.data.nonce))
      .catch(() => 0);
  } catch {
    nonce = 0;
  }

  return String(nonce + 1);
};

export const fetchBalance = async (address: string): Promise<number> => {
  const res = await axios.get(path(`/wallets/${address}`));

  return parseInt(res.data.data.balance);
};

export const fetchRegistrationDate = async (
  address: string
): Promise<{ username: string; registeredOn: string }> => {
  const res = await axios.post(path('/transactions/search'), {
    type: 2,
    typeGroup: 1,
    senderId: address
  });

  const tx = res.data.data[0];

  return {
    username: tx.asset.delegate.username,
    registeredOn: tx.timestamp.human
  };
};

export const broadcastTransaction = (tx: ITransactionData): Promise<IPostTransactionResponse> => {
  const transactions = [tx];

  return axios.post(path('/transactions'), { transactions });
};
