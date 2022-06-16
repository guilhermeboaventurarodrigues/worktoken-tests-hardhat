const { expect } = require("chai");
const { ethers } = require("hardhat");
const { it } = require("mocha");

describe("CryptoToken tests", function () {
  it("Checking Supply", async function () {
    const wrk = await ethers.getContractFactory("WorkToken");
    const wrkdeploy = await wrk.deploy(100);
    await wrkdeploy.deployed();

    expect(await wrkdeploy.totalSupply()).to.equal(100);
  });

  it("Supply To Owner", async function () {
    const [owner] = await ethers.getSigners();
    const wrk = await ethers.getContractFactory("WorkToken", owner);
    const wrkdeploy = await wrk.deploy(100);
    await wrkdeploy.deployed();

    expect(await wrkdeploy.balanceOf(owner.address)).to.equal(100);
  });

  it("TransferOk", async function () {
    const [owner, wallet1] = await ethers.getSigners();
    const wrk = await ethers.getContractFactory("WorkToken", owner);
    const wrkdeploy = await wrk.deploy(100);
    await wrkdeploy.deployed();

    await wrkdeploy.transfer(wallet1.address, 50);

    expect(await wrkdeploy.balanceOf(wallet1.address)).to.equal(50);
  });

  it("TransferNotBalance", async function () {
    const [owner, wallet1] = await ethers.getSigners();
    const wrk = await ethers.getContractFactory("WorkToken", owner);
    const wrkdeploy = await wrk.deploy(100);
    await wrkdeploy.deployed();
    await expect(wrkdeploy.transfer(wallet1.address, 101)).to.be.revertedWith(
      "Balance insuficient"
    );
  });

  it("Approve/Alowance", async function () {
    const [owner, wallet1] = await ethers.getSigners();
    const wrk = await ethers.getContractFactory("WorkToken", owner);
    const wrkdeploy = await wrk.deploy(100);
    await wrkdeploy.deployed();
    await wrkdeploy.approve(wallet1.address, 50);
    expect(await wrkdeploy.allowance(owner.address, wallet1.address)).to.equal(
      50
    );
  });

  it("TransferFrom", async function () {
    const [owner, wallet1, wallet2] = await ethers.getSigners();
    const wrk = await ethers.getContractFactory("WorkToken", owner);
    const wrkdeploy = await wrk.deploy(100);
    await wrkdeploy.deployed();
    await wrkdeploy.approve(wallet1.address, 50);
    await wrkdeploy
      .connect(wallet1)
      .transferFrom(owner.address, wallet2.address, 50);
    expect(await wrkdeploy.balanceOf(wallet2.address)).to.equal(50);
  });

  it("TransferFromAllowedNotBalance", async function () {
    const [owner, wallet1, wallet2] = await ethers.getSigners();
    const wrk = await ethers.getContractFactory("WorkToken", owner);
    const wrkdeploy = await wrk.deploy(100);
    await wrkdeploy.deployed();
    await wrkdeploy.approve(wallet1.address, 50);
    await expect(
      wrkdeploy
        .connect(wallet1)
        .transferFrom(owner.address, wallet2.address, 51)
    ).to.be.revertedWith("Allowed balance insufficient");
  });

  it("TransferFromSenderNotBalance", async function () {
    const [owner, wallet1, wallet2] = await ethers.getSigners();
    const wrk = await ethers.getContractFactory("WorkToken", owner);
    const wrkdeploy = await wrk.deploy(100);
    await wrkdeploy.deployed();
    await wrkdeploy.approve(wallet1.address, 100);
    await expect(
      wrkdeploy
        .connect(wallet1)
        .transferFrom(owner.address, wallet2.address, 200)
    ).to.be.revertedWith("Sender balance insufficient");
  });
});
