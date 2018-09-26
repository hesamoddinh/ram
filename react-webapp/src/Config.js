const isPrd = process.env.NODE_ENV === 'production'

const prdModeCfg = {
	api: {
		default: 'http://crypto.areatak.com/a',
		a: 'http://crypto.areatak.com/a',
		b: 'http://crypto.areatak.com/b',
		c: 'http://crypto.areatak.com/c'
	}
}

const devModeCfg = {
	api: {
		default: 'http://127.0.0.1:9001',
		a: 'http://127.0.0.1:9001',
		b: 'http://127.0.0.1:9002',
		c: 'http://127.0.0.1:9003'
	}
}

let cfg = {
	channel: 'common',
	chaincode: 'mycc',
	orgsPeers: {
		a: 'a/peer0',
		b: 'b/peer0',
		c: 'c/peer0'
	},
	api: isPrd ? prdModeCfg.api : devModeCfg.api
}

export default cfg
