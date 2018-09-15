import React from 'react';
import { Input, Row, Col, Form, Icon, Card, Button, Alert, Avatar } from 'antd';
import { web3, web3metamask } from 'utils/web3';
import { findGetParameter } from 'utils/util';
import { DonateContractMetamask } from 'contracts/contract';
import Header from 'components/Header';
import Footer from 'components/Footer';

const FormItem = Form.Item;
const { TextArea } = Input;

class DonateForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showMetamaskError: false,
      showNetworkWarning: false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        /* check metamask login status */
        if (!web3metamask || web3metamask.eth.accounts.length === 0) {
          this.state.showMetamaskError = true
          return
        } else {
          this.state.showMetamaskError = false
        }
        /* check metamask login status */
        if (web3metamask && web3metamask.version.network !== NETWORK_VERSION) {
          this.state.showNetworkWarning = true
          return
        } else {
          this.state.showNetworkWarning = false
        }
        console.log('Received values of form: ', values)
        let donateTransactionOptions = {
          from: web3metamask.eth.accounts[0],
          gas: 4000000,
          gasPrice: web3.toWei(20, 'gwei'),
          value: web3.toWei(values.damount, 'ether')
        }
        console.log(donateTransactionOptions)
        DonateContractMetamask.donate(values.daddr, values.ddonor, values.dmssg, donateTransactionOptions,
          function (error, result) {
            if (!error) {
              console.log(result)
            } else {
              console.log(error)
            }
          })
      }
    })
  }

  componentDidMount () {
    this.props.form.setFieldsValue({
      daddr: findGetParameter('addr')
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
      <Header/>
      <Row
        className = 'main-bg-color'
        style={{
          paddingBottom: '80px',
          minHeight: '90vh',
          marginTop: '-1px'
        }}
        type="flex"
        justify="space-around"
        align="middle"
      >
        <Col style={{
          width: '45vh'
        }}>
          <Card title={
            <div>
              <Avatar size={42} src="https://i.imgur.com/V89IcdI.png"/> 
              <span>Donate Information</span>
            </div>
          } style ={{marginTop: '12%'}}>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <div> Streamer's Address </div>
              <FormItem>
                {getFieldDecorator('daddr', {
                  rules: [{ required: true, message: `Please input the streamer's wallet address!` }]
                })(
                  <Input prefix={<Icon type="wallet" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="Address"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('ddonor', {
                  rules: [{ required: true, message: 'Please input your donate username' }]
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Donor Username" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('damount', {
                  rules: [{ required: true, message: 'Please input the amount of ETH' }]
                })(
                  <Input type='number' prefix={<Icon type="red-envelope" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="0.00 ETH" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('dmssg', {
                  rules: [{ required: true, message: 'Please say something :o' }]
                })(
                  <TextArea maxLength="100" prefix={<Icon type="red-envelope" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Donate messages (100 characters)" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Donate
                </Button>
              </FormItem>
            </Form>
            { this.state.showMetamaskError ? <div
              style = {{marginBottom: '10px'}}
              justify="space-around"
            > <Alert
                message="Metamask not login"
                description={ <div>Please ensure you have installed <a href="https://metamask.io">Metamask</a> and login </div>}
                type="error"
                showIcon
              /></div> : null }
            { this.state.showNetworkWarning ? <div> <Alert
              message="Network warning"
              description= { <div>Please switch to {NETWORK_NAME} </div>}
              type="warning"
              showIcon
            /> </div> : null }
          </Card>
        </Col>
      </Row>
      <Footer/>
      </div>
    )
  }
}

const WrappedDonateForm = Form.create()(DonateForm)
export default WrappedDonateForm
