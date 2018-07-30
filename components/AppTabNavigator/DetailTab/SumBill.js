import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'

import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'

class SumBill extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showsummoney: [],
            showStatusreport: [],
            showinvoicedetail_ID: [],
            showmoneyfile: [],
        }
        this.props.client.resetStore();
        this.summoney();
        this.summoneyfail();
    }

    summoney = () => {
        console.log("summoney")

        this.props.client.query({
            query: summoney,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(result.data.summoney)
            this.setState({
                showsummoney: result.data.summoney
            })
        }).catch((err) => {
            console.log(err)
        });
    }
    summoneyfail = () => {
        console.log("summoneyfail")

        this.props.client.query({
            query: summoneyfail,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(result.data.summoneyfail)
            this.setState({
                showmoneyfile: result.data.summoneyfail
            })
        }).catch((err) => {
            console.log(err)
        });
    }

    checkinvoicereport = () => {
        const { navigate } = this.props.navigation
        this.props.client.query({
            query: checkinvoicereport,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log("checkinvoicereport", result.data.checkinvoicereport)
            this.setState({ showinvoicedetail_ID: result.data.checkinvoicereport })
            console.log("NUM", this.state.showinvoicedetail_ID.length)
            if (this.state.showinvoicedetail_ID.length > 0) {
                this.reportsubmitwork();
            } else {
                navigate('SumBill')
            }

        }).catch((err) => {
            console.log("err of checkinvoicereport", err)
        });
    }


    reportsubmitwork = () => {
        console.log("reportsubmitwork")
        this.props.client.mutate({
            mutation: reportsubmitwork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(global.NameOfMess)
            console.log("result", result.data.reportsubmitwork)
            this.state.showinvoicedetail_ID.map(l => (
                this.reportdetail(l.invoiceNumber)
            ));
        }).catch((err) => {
            console.log("error of reportsubmitwork", err)
        });
    }

    reportdetail = (id) => {
        const { navigate } = this.props.navigation
        console.log("reportdetail")

        this.props.client.mutate({
            mutation: reportdetail,
            variables: {
                "invoiceNumber": id
            }
        }).then((result) => {
            console.log("...")
            navigate('MainMenu')
        }).catch((err) => {
            console.log("error", err)
        });
    }
    _PRESS_SearchTab = () => {
        // const { navigate } = this.props.navigation
        this.checkinvoicereport();
        // this.billTOapp();

        // this.state.showINVOICE_ID.map(l => (
        //     this.detailtoapp(l.INVOICEID)
        // ));
        // navigate('HomeTab')
    }

    static navigationOptions = {
        header: null
    }
    render() {

        const { navigate } = this.props.navigation

        return (

            <Container>
                <Header style={{ backgroundColor: '#66c2ff' }}>
                    <Left>
                        <Button transparent
                            onPress={() => navigate('Search')}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>สรุปยอดเงิน</Title>
                    </Body>
                    <Right />
                </Header>

                <Content>
                    <View>
                        {
                            this.state.showsummoney.map((l, i) => (
                                <View>
                                    <View style={{ margin: 30, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>สรุปยอดเงินที่ต้องโอน  </Text>
                                    </View>

                                    <View style={{ margin: 45, marginTop: 5, justifyContent: 'center' }}>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ width: Dimensions.get('window').width / 1.6 }} >ยอดงเงินตามบิลจริง : </Text>
                                            <Text style={{ width: Dimensions.get('window').width / 1.6, fontSize: 15, color: 'orange' }} >{l.amountBill} ฿ </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ width: Dimensions.get('window').width / 1.6 }} >ยอดเงินที่เก็บได้ : </Text>
                                            <Text style={{ width: Dimensions.get('window').width / 1.6, fontSize: 15, color: 'orange' }} >{l.amountActual} ฿ </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ width: Dimensions.get('window').width / 1.6 }} >ยอดที่เก็บไม่ได้ : </Text>
                                            <View style={{ width: Dimensions.get('window').width / 1.6 }} >
                                                {
                                                    this.state.showmoneyfile.map((V, i) => (
                                                        <Text style={{ fontSize: 15, color: 'orange' }}>{V.amountBill} ฿ </Text>
                                                    ))
                                                }
                                            </View>
                                        </View>

                                    </View>

                                    <View style={{ margin: 30, marginTop: 5, justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ width: Dimensions.get('window').width / 1.5, fontWeight: 'bold' }} >ยอดเงินที่ต้องโอนเข้าบัญชีของบริษัท : </Text>
                                            <Text style={{ width: Dimensions.get('window').width / 1.5, fontSize: 16.5, color: 'orange', fontWeight: 'bold' }} >{l.amountActual} ฿ </Text>
                                        </View>
                                    </View>


                                    <View style={{ margin: 30, marginTop: 5, justifyContent: 'center' }}>
                                        <Text>หมายเลขบัญชี 476-800-083-7  </Text>
                                        <Text>พร้อมเพย์ 099-9999-000  </Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>


                </Content>
                <Footer  >
                    <TouchableOpacity onPress={
                        this._PRESS_SearchTab.bind(this)
                    }//navigate('HomeTab')
                    >
                        <View style={{
                            width: Dimensions.get('window').width / 2,
                            height:'100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 5,
                            backgroundColor: '#33CC33',
                        }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>เคลียร์งาน</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigate('DetailBill')}>
                        <View style={{
                            width: Dimensions.get('window').width / 2,
                            height:'100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 5,
                            backgroundColor: '#ff6c00',
                        }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>รายละเอียดยอดเงิน</Text>
                        </View>
                    </TouchableOpacity>

                </Footer>
            </Container>

        )

    }
}


const GraphQL = compose(SumBill)
export default withApollo(GraphQL)

const summoney = gql`
query summoney($MessengerID:String!){
                    summoney(MessengerID: $MessengerID){
                    amountBill
    amountActual
                }
              }
              `
const summoneyfail = gql`
query summoneyfail($MessengerID:String!){
                    summoneyfail(MessengerID: $MessengerID){
                    amountBill
    amountActual
                }
              }
              `

const reportsubmitwork = gql`
    mutation reportsubmitwork($MessengerID:String!){
                    reportsubmitwork(MessengerID: $MessengerID){
                    status
                }
                }
            `
const reportdetail = gql`
    mutation reportdetail($invoiceNumber:String!){
                    reportdetail(invoiceNumber: $invoiceNumber){
                    status
                }
                }
            `
const checkinvoicereport = gql`
    query checkinvoicereport($MessengerID:String!){
                    checkinvoicereport(MessengerID: $MessengerID){
                    invoiceNumber
                }
                }
            `

const styles = StyleSheet.create({

    detailContent: {
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
        borderColor: 'white',
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        justifyContent: 'center'
    }
})
