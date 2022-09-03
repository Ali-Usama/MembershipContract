console.log("in start of config file")
const express = require('express')
const bodyparser = require('body-parser')

const app = express()
app.use(bodyparser.json())

const port = 5000

const App = async (req, res) => {
    console.log("body data", req.body)
    const { Connection, PublicKey } = require('@solana/web3.js')
    const { AnchorProvider, BN, Program, Provider, web3 } = require('@project-serum/anchor')
    const { ConnectionProvider, useWallet, WalletProvider } = require('@solana/wallet-adapter-react')
    const idl = require('./idl.json')
    const { log } = require('console')

    async function getProvider() {
        const wallet = useWallet();
        console.log("wallet", wallet);
        const opts = {
            preflightCommitment: "processed"
        }
        /* create the provider and return it to the caller */
        /* network set to local network for now */
        const network = "https://api.devnet.solana.com";
        const connection = new Connection(network, opts.preflightCommitment);

        return new AnchorProvider(
            connection, wallet, opts.preflightCommitment,
        );
    }

    const programID = new PublicKey(idl.metadata.address);
    console.log("sdfkh", programID)
    const { SystemProgram, Keypair } = web3;

    const provider = await getProvider()
    console.log("Provider: ", provider);
    const receiver = new web3.PublicKey("B6BoFL6JdEVCw2QWTgyyEttAR4qKSWXhEReaEfcaYtmR");
    const treasury = new web3.PublicKey(req.body.address.toString());
    // console.log("Treasury: ", window.solana.publicKey.toString());
    const lamports = new BN(1000000000);
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    try {
        /* interact with the program via rpc */
        await program.methods.transferLamports(lamports).accounts({
            from: treasury,
            to: receiver,
            systemProgram: SystemProgram.programId,
        }).rpc();
        console.log("tx")
        res.json({ msg: "Successfully dsfasdfad" })

    } catch (err) {
        console.log("Transaction error: ", res.json({ msg: err }));
    }
}

// var array=[1,2,3]
app.post('/Transection', async (req, res) => {
    console.log(req.body.address)
    // res.json({ msg: "Successfully dsfasdfad" })

    App(req, res)

})

app.listen(port, () => {
    console.log("listening to port" + port)
})