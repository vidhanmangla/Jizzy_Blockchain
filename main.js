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
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {

    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "01/10/2022", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

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
jizzyCoin.addBlock(new Block(1, "02/10/2022", { amount: 4 }));
jizzyCoin.addBlock(new Block(2, "03/10/2022", { amount: 10 }));

console.log('Is blockchain valid? ' + jizzyCoin.isChainValid());

//console.log(JSON.stringify(jizzyCoin, null, 4));