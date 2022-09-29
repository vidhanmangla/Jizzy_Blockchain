// npm install --save crypto-js
const SHA256 = require('crypto-js/sha256');

class Block {

    /*  index: Tells us where the block sits on the chain.
        timestamp: Tells us when the block was created.
        data: Any type of data that you want to associate with this block.
        previousHash: Contains the hash of the block before this one.
    */
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // Adding proof-of-work
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock(){
        return new Block(0, "01/10/2022", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    // To verify the integrity of the blockchain
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let jizzyCoin = new Blockchain();

console.log('Mining block 1...');
jizzyCoin.addBlock(new Block(1, "02/10/2022", { amount: 4 }));

console.log('Mining block 2...');
jizzyCoin.addBlock(new Block(2, "03/10/2022", { amount: 10 }));


// The blockchain is meant to add blocks to it, but never delete a block/change a block.