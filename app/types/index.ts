export type Expense = {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  organization_id: string;
  user_id: string;
  receipt_url: string;
};