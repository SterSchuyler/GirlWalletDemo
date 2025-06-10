import { User } from '../types/user';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyPhone: {
    phoneNumber: string;
    onVerificationComplete: () => void;
  };
  Profile: undefined;
  Settings: undefined;
  ChangePin: undefined;
  Contacts: undefined;
  ChatList: undefined;
  ChatRoom: { chatId: string };
  NewChat: undefined;
  Wallet: undefined;
  SendMoney: undefined;
  ReceiveMoney: undefined;
  TransactionHistory: undefined;
  Home: undefined;
}; 