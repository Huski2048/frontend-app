export enum PoolId {
  ibBUSD = 1,
  ibBNB = 2,
  ibUSDT = 3,
  ibETH = 8,
  ibBTCB = 10,
  ibUSDC = 12
}

const pools = {
  ibBNB:
  {
    symbol: "ibBNB",
    address: {
      97: '',
      56: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
    },
    config: {
      56: '0xb259C8E25c04403700B3b4c3c0f95E9db6C8b03A',
      97: '',
    },
    pid: 3,
    debtPid: 2
  },
  ibBUSD:
  {
    symbol: "ibBUSD",
    address: {
      97: '',
      56: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
    },
    config: {
      56: '0x2BE54c7feA2b0aF959a25B740d701eAa564Aa838',
      97: '',
    },
    pid: 1,
    debtPid: 0
  },
  ibUSDT:
  {
    symbol: "ibUSDT",
    address: {
      97: '',
      56: "0xbD91429B7546AFe01c2CC4a4587bBB2E66302534",
    },
    config: {
      56: '0xef4e6708b442dB6094a792cB97FCBF362255a506',
      97: '',
    },
    pid: 5,
    debtPid: 4
  },
  ibBTCB:
  {
    symbol: "ibBTCB",
    address: {
      97: '',
      56: "0x5E33c3D92310135973A70cb02E24e8a116a20052",
    },
    config: {
      56: '0x65Deae7E95C1abCe78AbEDD1e37f86519b3B412e',
      97: '',
    },
    pid: 10,
    debtPid: 9
  },
  ibETH:
  {
    symbol: "ibETH",
    address: {
      97: '',
      56: "0x85549eac2c801dbd20964f7f6248f9ed32bd4efb",
    },
    config: {
      56: '0xDf71835BFdCc03543adb025273de1b10f6121494',
      97: '',
    },
    pid: 8,
    debtPid: 6
  },
  ibUSDC:
  {
    symbol: "ibUSDC",
    address: {
      97: '',
      56: "0xe363355790cfc313f5ab1939155356e72bf662fb",
    },
    config: {
      56: '0xF0D6682Bf0A1089dAfF72151dBD3DCae7355b96C',
      97: '',
    },
    pid: 12,
    debtPid: 11
  },
}

export default pools
