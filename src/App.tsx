import {
  useEffect,
  useState
} from 'react';

import './App.scss';

import IXilyACTIV from '@ixily/activ-web';
import detectEthereumProvider from '@metamask/detect-provider';

const App = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<any>([]);

  const init = async () => {
    try {

      setLoading(true);

      const ethereum: any = await detectEthereumProvider();

      await ethereum?.request({ method: 'eth_requestAccounts' });

      const chainIds: any = {
        goerli: 5,
        hardhat: 1337,
        kovan: 42,
        mainnet: 1,
        rinkeby: 4,
        ropsten: 3,
        mumbai: 80001,
        sepolia: 11155111,
      };

      const getNetworkName = (nId: string) =>
        Object.keys(chainIds)?.find(
          (key: any) => chainIds[key]?.toString() === nId?.toString()
        ) || null;

      const defaultNetwork: any = ethereum?.networkVersion || null;
      const networkName: any = getNetworkName(defaultNetwork);

      const providerWorks = (window as any).ethereum;

      const isPublic = providerWorks === null ? true : false;

      const activ = new IXilyACTIV({
        webProvider: ethereum,
        public: isPublic,
      });

      if (activ) {
        await activ.init({
          network: networkName,
          showLogsToDebug: true,
        })

        const ideas = await activ.getAllIdeas(1, 30);

        setIdeas(ideas?.data);
        setLoading(false);

      }

    } catch (err: any) {
      console.log('error', err.message);
    }
  };

  const goToIPFSUrl = (idea: any) => {
    window.open(idea?.url, '_blank');
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <h1 className='title'>ACTIV Ideas</h1>
      {loading ? <div className="loading"><img src="src/loader.gif"></img></div> : null}
      <div className='main-container'>
        {
          ideas?.map((idea: any) => {
            return (
              <div className="box1 box" key={idea?.nftId}>
                <div className="content">
                  <div className="image">
                    <img src={idea?.idea?.public?.image} alt={idea?.nftId} className='ticker-logo' />
                  </div>
                  <div className="level">
                    <p>{idea?.idea?.idea?.kind || 'unknow'}</p>
                  </div>
                  <div className="text">
                    <p className="name">{idea?.idea?.idea?.asset?.ticker}</p>
                    <p className="job_title">{idea?.name}</p>
                    <p className="job_discription">{idea?.description}</p>
                  </div>
                  <div className="button">
                    <div>
                      <button className="message" type="button" onClick={() => goToIPFSUrl(idea)}>See IPFS content</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default App;
