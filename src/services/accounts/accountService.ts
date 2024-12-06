import Account from '@models/account/Account';
import { PlaidAccount } from '@models/account/PlaidAccount';
import User from '@models/user/User';

interface AddAccountParams {
  plaidAccountId: string;
  ownerUserId: string;
  name: string;
  officialName?: string;
  type?: string;
  subtype?: string;
}

export async function addAccount(params: AddAccountParams) {
  // Ensure no duplicate accounts
  const existing = await Account.findOne({ plaidAccountId: params.plaidAccountId });
  if (existing) {
    throw new Error('Account already exists');
  }

  const account = new Account({
    ownerUserId: params.ownerUserId,
    plaidAccountId: params.plaidAccountId,
    shared: false,
    name: params.name,
    officialName: params.officialName,
    type: params.type,
    subtype: params.subtype
  });

  await account.save();
  return account;
}

export async function markAccountAsShared(accountId: string, currentUserId: string, partnerUserId: string) {
  const account = await Account.findById(accountId);
  if (!account) throw new Error('Account not found');
  if (account.ownerUserId !== currentUserId) throw new Error('Only owner can mark account as shared');

  account.shared = true;
  account.sharedWithUserId = partnerUserId;
  await account.save();
  return account;
}

export async function getVisibleAccountsForUser(userId: string) {
  // Accounts owned by user
  const ownedAccounts = await Account.find({ ownerUserId: userId });

  // Accounts shared with this user
  const sharedAccounts = await Account.find({ sharedWithUserId: userId });

  return [...ownedAccounts, ...sharedAccounts];
}


export async function addOrUpdateAccounts(ownerUserId: string, plaidAccounts: PlaidAccount[]) {
    for (const pacc of plaidAccounts) {
      const existing = await Account.findOne({ plaidAccountId: pacc.account_id });
      if (!existing) {
        // create new
        await Account.create({
          ownerUserId,
          plaidAccountId: pacc.account_id,
          shared: false,
          name: pacc.name,
          officialName: pacc.official_name,
          type: pacc.type,
          subtype: pacc.subtype
        });
      } else {
        // update existing name/type if changed
        existing.name = pacc.name;
        existing.officialName = pacc.official_name;
        existing.type = pacc.type;
        existing.subtype = pacc.subtype;
        await existing.save();
      }
    }
  }