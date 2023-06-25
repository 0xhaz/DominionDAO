const DominionDao = artifacts.require("DominionDAO");

module.exports = async function (deployer) {
  await deployer.deploy(DominionDao);
};
