const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash;
    }

    calculateHash(){
        //  Generate a hash for the block
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    //  Generates the first block in the block chain
    createGenesisBlock(){
        return new Block(0, Date.now(), "Genesis Block", "0")
    }

    //  Returns the last block in the blockchain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    //  Creates a new block in the blockchain
    addBlock(newBlock) {

        //  Each block must know the previous hash
        newBlock.previousHash = this.getLatestBlock().hash;

        //
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let EzBlock = new Blockchain;
EzBlock.addBlock(new Block(1, Date.now(), {amount: 3}));
EzBlock.addBlock(new Block(2, Date.now(), {amount: 5}));

console.log(JSON.stringify(EzBlock, null, 4) + "\n");
console.log("Is the blockchain valid?: " + EzBlock.isChainValid() + "\n");

console.log("What if we tamper with a block's data and recalculate the hash?" + "\n");
EzBlock.chain[1].data = {amount: 12};
EzBlock.chain[1].hash = EzBlock.chain[1].calculateHash();

console.log("Is the blockchain still valid?: " + EzBlock.isChainValid());