const ethers = require('ethers');

const UserChallenge = require('../models/userChallenge.model');
const ChallengeInfo = require('../models/challenge.model');
const user = require('../models/user.model');

const dynamicPoolContractAbi =
  require('./../../proto.v2-contract/artifacts/contracts/dynamicpool/DynamicPool.sol/DynamicPool.json').abi;

require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);

const ServerPrivateKey = process.env.SERVER_PRIVATE_KEY;
const ServerWallet = new ethers.Wallet(ServerPrivateKey, provider);

const transferToUser = async (contractAddress, amount, userAddress) => {
  const contract = new ethers.Contract(
    contractAddress,
    dynamicPoolContractAbi,
    ServerWallet
  );

  const amountInWei = ethers.utils.parseEther(amount.toString());

  const withdrawal = await contract.transferTo(userAddress, amountInWei);
  const receipt = await withdrawal.wait();

  return receipt;
};

module.exports = {
  DepositPool: async (req, res) => {
    try {
      const { userChallengeId, depositMethod, deposit } = req.body;

      const userChallengeInfo = await UserChallenge.findById(userChallengeId).populate(
        'challengeId'
      );

      if (!userChallengeInfo) {
        return res.status(404).json({
          error: 'User Challenge not found',
        });
      }

      userChallengeInfo.depositMethod = depositMethod;
      userChallengeInfo.deposit = deposit;
      userChallengeInfo.save();

      userChallengeInfo.challengeId.cryptoSuccessPool += deposit;
      userChallengeInfo.challengeId.participants += 1;
      userChallengeInfo.challengeId.save();

      res.status(200).json({
        message: 'Crypto deposit received',
        depositInfo: {
          userChallengeId: userChallengeInfo._id,
          depositMethod: userChallengeInfo.depositMethod,
          deposit: userChallengeInfo.deposit,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
  providePayback: async (req, res) => {
    try {
      const { userChallengeId } = req.body;

      const userChallenge = await UserChallenge.findById(userChallengeId).populate(
        'challengeId',
        'userId'
      );

      if (!userChallenge) {
        return res.status(404).json({
          error: 'User Challenge not found',
        });
      }

      const updatedUserChallenge = await UserChallenge.findByIdAndUpdate(
        userChallengeId,
        { $set: { isPaybackPaid: true } },
        { new: true }
      );

      const challengeInfo = await ChallengeInfo.findByIdAndUpdate(
        userChallenge.challengeId._id,
        { $inc: { participants: -1 } },
        { new: true }
      );

      const userAddress = userChallenge.userId.wallet;

      if (updatedUserChallenge.successRate === 100) {
        await transferToUser(
          challengeInfo.successPoolAddress,
          updatedUserChallenge.deposit,
          userAddress
        );

        const profit =
          updatedUserChallenge.challengeId.cryptoFailPool *
          (updatedUserChallenge.deposit /
            updatedUserChallenge.challengeId.cryptoSuccessPool) *
          0.6;

        const updatedUserChallenge = await UserChallenge.findByIdAndUpdate(
          userChallengeId,
          {
            $set: { profit: profit },
          },
          { new: true }
        );

        await transferToUser(challengeInfo.failPoolAddress, reward, userAddress);
      } else if (updatedUserChallenge.successRate >= 80) {
        await transferToUser(
          challengeInfo.successPoolAddress,
          updatedUserChallenge.deposit,
          userAddress
        );
      } else {
        const total = updatedUserChallenge.deposit + updatedUserChallenge.profit;
        await transferToUser(challengeInfo.successPoolAddress, total, userAddress);
      }

      res.status(200).json({
        message: 'Payback provided',
        paybackInfo: {
          successRate: updatedUserChallenge.successRate,
          totalPayback: updatedUserChallenge.deposit + userChallenge.profit,
          myDeposit: updatedUserChallenge.deposit,
          myProfit: updatedUserChallenge.profit,
          isPaybackPaid: updatedUserChallenge.isPaybackPaid,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },
};
