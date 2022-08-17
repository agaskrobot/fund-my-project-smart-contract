import { expect, assert } from "chai";
import { ethers } from "hardhat";

describe("FundMyProject", function () {
  let accounts: any;
  let factory: any;
  let projectAddress;
  let project: any;
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const FundMyProjectFactory = await ethers.getContractFactory("FundMyProjectFactory");
    factory = await FundMyProjectFactory.deploy();

    await factory.createProject("100");
    [projectAddress] = await factory.getDeployedProjects();
    project = await ethers.getContractAt("FundMyProject", projectAddress);
  });

  describe("FundMyProject", function () {
    it("Deploys factory and project", () => {
      assert.ok(factory.address);
      assert.ok(project.address);
    });

    it("Manager is the account[0]", async () => {
      const manager = await project.manager();
      const address = await accounts[0].getAddress();
      expect(manager).equal(address);
    });

    it("Allows people to donate and marks them as approvers", async () => {
      const address = await accounts[0].getAddress();
      await project.contribute({ value: "200", from: address });
      const isContributor = project.approvers(address);
      assert(isContributor);
    });

    it("Requires minimum donate", async () => {
      try {
        const address = await accounts[0].getAddress();
        await project.contribute({ value: "50", from: address });
        assert(false);
      } catch (error) {
        assert(error);
      }
    });

    it("Allows manager to call payment request", async () => {
      const address = await accounts[1].getAddress();
      await project.createRequest("Buy bla bla", "100", address);
      const request = await project.requests(0);
      assert.equal("Buy bla bla", request.description);
    });

    it("Process requests", async () => {
      const managerAddress = await accounts[0].getAddress();
      const recipientAddress = await accounts[1].getAddress();

      await project.contribute({
        value: ethers.utils.parseEther("10"),
        from: managerAddress,
      });

      await project.createRequest(
        "Buy bla bla",
        ethers.utils.parseEther("5"),
        recipientAddress
      );

      await project.approveRequest(0);
      await project.finalizeRequest(0);

      let recipientBalance = await accounts[1].getBalance();
      recipientBalance = ethers.utils.formatEther(recipientBalance);
      recipientBalance = parseFloat(recipientBalance);

      const request = await project.requests(0);
      assert(recipientBalance > 104);
    });
  });
});
