import React from 'react';
import { Row } from 'antd';
import styled from 'styled-components';
import { web3 } from 'utils/web3';
import { findGetParameter } from 'utils/util';
import { DonateContract } from 'contracts/contract';

const PromptText = styled.div`
	color: #000;
	margin-top: 50%;
	font-size: 3em;
	text-align: center;
	-webkit-transition: opacity 5s ease-in-out;
	-moz-transition: opacity 5s ease-in-out;
	-ms-transition: opacity 5s ease-in-out;
	-o-transition: opacity 5s ease-in-out;
	opacity: 1;
`
const IconImage = styled.img`
	display: inline-block !important;
	height: 80px;
`;

const DonateMessageContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center; 
`;

const DonateMessageTitle = styled.div`
	font-size: 4em;
	margin: 0 10px;
	color: #fff;
	// text-shadow:
	// 1px 1px 0 #000,
	// -1px -1px 0 #000,  
 	// 1px -1px 0 #000,
 	// -1px 1px 0 #000,
	// 1px 1px 0 #000;
	text-shadow: 2px 2px #000;
`;

class NotiPage extends React.Component {
    constructor (props) {
			super(props)    
			this.state = {
				isBlank: false,
				donationAlert: false,
				donorAddress: '',
				donorName: '',
				recvAddress: '',
				donateMssg: '',
				donateValue: 0.0
			}
    }

    componentDidMount () {
			setTimeout( () => { this.setState({isBlank: true })}, 3000);
			let donateEvent = DonateContract.NewDonation();
			let that = this;
			donateEvent.watch(function (error, result) {
				console.log(result);			
				let addr = findGetParameter('addr');
				if(addr != result.args.raddr) return;
				that.setState({
					donationAlert: true,
					donorAddress: result.args.daddr,
					donorName: result.args.donor,
					recvAddress: result.args.raddr,
					donateMssg: result.args.message,
					donateValue: +parseFloat(web3.fromWei(result.args.value.toNumber(), "ether" )).toFixed(7)
				})
				setTimeout( () => { that.setState({donationAlert: false })}, 15000);
			});
    }

    render() {
		return (
			<Row
				style={{
					height: '100vh',
					transition: 'background-color 5s linear',
				}}
				type="flex"
				justify="space-around"
				align="top"
				>

				{!this.state.donationAlert ? <PromptText style={ this.state.isBlank ? {opacity: 0} : null}>
					The donate messages will show up on this page
				</PromptText> : null}
				{ this.state.donationAlert ? 
				<div style={{marginTop:'3%'}}>
					<DonateMessageContainer>
						<DonateMessageTitle style={{color: '#81D4FA'}}> {this.state.donorName} </DonateMessageTitle> 
					</DonateMessageContainer>
					<DonateMessageContainer>
						<DonateMessageTitle style={{fontSize: '3em'}}> <IconImage src="https://i.imgur.com/NGldgtT.png" /> {this.state.donateValue}</DonateMessageTitle>
					</DonateMessageContainer>
					<DonateMessageContainer>
						<DonateMessageTitle style={{fontSize: '3.2em', textAlign: 'center'}}> {this.state.donateMssg} </DonateMessageTitle>
					</DonateMessageContainer>
				</div>
				: null	}
			</Row>
		)
    }

}


export default NotiPage
