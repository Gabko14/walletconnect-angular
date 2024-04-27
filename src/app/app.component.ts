import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { createWeb3Modal } from '@web3modal/wagmi';
import type { Web3Modal } from '@web3modal/wagmi';

import { reconnect, http, createConfig, disconnect, getAccount } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { coinbaseWallet, walletConnect, injected } from '@wagmi/connectors';

import { environment } from '../environments/environment';

// https://docs.walletconnect.com/web3modal/javascript/about?platform=wagmi
// /\ Implementation - Wagmi - Custom: https://github.com/WalletConnect/walletconnect-docs/blob/13c71646d2e3c0557b6aee541cd16079acd2f426/docs/web3modal/javascript/wagmi/about/triggermodal.mdx?plain=1#L51
// /\ Trigger the modal - Wagmi - Actions: https://github.com/WalletConnect/walletconnect-docs/blob/13c71646d2e3c0557b6aee541cd16079acd2f426/docs/web3modal/javascript/wagmi/about/implementation.mdx?plain=1#L58
// Source: https://github.com/WalletConnect/web3modal/tree/V4/packages/wagmi

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
	projectId = environment['PROJECT_ID'];
	modal!: Web3Modal;
	metadata = {
		name: 'Web3Modal',
		description: 'Web3Modal Example',
		url: 'https://web3modal.com', // url must match domain & subdomain
		// url: 'http://localhost:4200',
		icons: ['https://avatars.githubusercontent.com/u/37784886']
	};
	config = createConfig({
		chains: [mainnet, sepolia],
		transports: {
			[mainnet.id]: http(),
			[sepolia.id]: http()
		},
		connectors: [
			walletConnect({ projectId: this.projectId, metadata: this.metadata, showQrModal: false }),
			injected({ shimDisconnect: true })
			// coinbaseWallet({
			// 	appName: this.metadata.name,
			// 	appLogoUrl: this.metadata.icons[0]
			// })
		]
	});

	constructor() {}

	ngOnInit() {
		this.initWeb3Modal();
	}

	initWeb3Modal() {
		reconnect(this.config);

		this.modal = createWeb3Modal({
			wagmiConfig: this.config,
			projectId: this.projectId,
			enableAnalytics: true, // Optional - defaults to Cloud configuration
			enableOnramp: true // Optional - false as default
		});
	}

	openWalletConnectModal() {
		getAccount(this.config).isConnected ? disconnect(this.config) : this.modal.open();
	}
}
