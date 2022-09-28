extern crate core;

use anchor_lang::prelude::*;
use anchor_lang::{
    solana_program::{ system_instruction, program::invoke},
};

declare_id!("Euko1wsUrXyA8tXJRbEEiVTEqpwTfom48Zy3Z6HYNqjn");

#[program]
pub mod checkout_transactions {
    use anchor_lang::solana_program::entrypoint::ProgramResult;
    use super::*;

    /// Transfers 1SOL from one account (must be program owned)
    /// to another account. The recipient can by any account
    pub fn transfer_lamports(ctx: Context<Checkout>, base_account_bump: u8, lamports: u64,
    ) -> ProgramResult {
        // const AMOUNT: u64 = 1000000000;
        ctx.accounts.member_account.bump = base_account_bump;
        let member_account = &mut ctx.accounts.member_account;

        if member_account.is_member {
            return Err(ProgramError::AccountAlreadyInitialized);
        }

        member_account.is_member = true;
        let ix = system_instruction::transfer(
            &ctx.accounts.from.key(),
            &ctx.accounts.to.key(),
            lamports,
        );
        invoke(&ix, &[
            ctx.accounts.from.to_account_info(),
            ctx.accounts.to.to_account_info(),
            // ctx.accounts.owner.to_account_info().clone(),
            ctx.accounts.system_program.to_account_info().clone(),
        ],
        )
    }


}


#[derive(Accounts)]
#[instruction(vote_account_bump: u8)]
pub struct Checkout<'info> {

    #[account(init, seeds = [b"vote_account".as_ref(), from.key().as_ref()], bump,
    payer = from, space = 8 + 16)]
    member_account: Account<'info, MembershipState>,
    #[account(mut)]
    from: Signer<'info>,

    // destination
    /// CHECK:
    #[account(mut)]
    to: AccountInfo<'info>,

    // #[account(signer)]
    // pub owner: Signer<'info>,
    // misc
    system_program: Program<'info, System>,
}


#[account]
#[derive(Default)]
pub struct MembershipState {
    is_member: bool,
    bump: u8,
}




