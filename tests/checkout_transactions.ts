import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {utf8} from "@project-serum/anchor/dist/cjs/utils/bytes";
import {CheckoutTransactions} from "../target/types/checkout_transactions";
import {PublicKey} from "@solana/web3.js";

const MEMBERSHIP_PROGRAM = new anchor.web3.PublicKey("4DMFEdzUx65CZRLiuF3dpfRfAvdvmNftQLRuAKq8n3nW")

describe("checkout_transactions", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.CheckoutTransactions as Program<CheckoutTransactions>;

    it("Is initialized!", async () => {
        // Add your test here.
        const receiver = new anchor.web3.PublicKey("Buy5LSN7MLGmi12o3YxVZPVrzDToXnyTS2NtCzEC5q2M");

        const treasury = new anchor.web3.PublicKey("B6BoFL6JdEVCw2QWTgyyEttAR4qKSWXhEReaEfcaYtmR");
        const lamports = new anchor.BN(1000000000);
        console.log("Test")

        let [memberAccount, memberBump] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('vote_account'), treasury.toBuffer()],
            program.programId
        );

        console.log("Member Account: ", memberAccount.toString());
        console.log("Member Bump: ", memberBump);


        const tx = await program.methods.transferLamports(memberBump).accounts({
            from: treasury,
            memberAccount: memberAccount,
            to: receiver,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).rpc();
        console.log("Your transaction signature", tx);
        const membershipState = await program.account.membershipState.fetch(memberAccount);
        console.log('State: ', membershipState.isMember, ' ', membershipState.bump);

    });
});
