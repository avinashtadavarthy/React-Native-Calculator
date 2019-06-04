import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions
} from 'react-native';
const { width } = Dimensions.get('window');
//import console = require('console');

export default class App extends React.Component {

  constructor() {
    super()
    this.state = {
      calcText: "",
      resText: "",

      //ui params
      screenWidth: 0,

      //mode variables
      mode: "light",
      modeText: "DARK",
      bgColor: '#ffffff',
      numColor: '#F0F8FF',
      opColor: '#D3D3D3',
      eqColor: '#FFD700',
      textColor: '#000000'
    }
  }

  darkModeEnable() {

    if(this.state.mode == "light") {

      this.setState({
        mode: "dark",
        modeText: "LIGHT",
        bgColor: '#323232',
        numColor: '#000000',
        opColor: '#5c5c5c',
        eqColor: '#FF4500',
        textColor: '#ffffff'
      });
      StatusBar.setBarStyle('light-content', true);

    } else if(this.state.mode == "dark") {

      this.setState({
        mode: "light",
        modeText: "DARK",
        bgColor: '#ffffff',
        numColor: '#F0F8FF',
        opColor: '#D3D3D3',
        eqColor: '#FFD700',
        textColor: '#000000'
      });
      StatusBar.setBarStyle('dark-content', true);

    }
    
  }

  calculateResult() {
    
    let text = this.state.calcText
    let last = text.length - 1

    if(text[last] == '+' || text[last] == '-' || text[last] == '×' || text[last] == '÷') {
      this.setState({
        resText: ""
      })
      return
    } else {
      let str = text.replace(/×/g,'*');
      str = str.replace(/÷/g,'/');

      let result = eval(str)

      this.setState({
        resText: result
      })
    }

  }

  operate(operation) {
    let text = this.state.calcText
    let last = text.length - 1
    switch(operation) {
      case '+': 
      case '-': 
      case '×': 
      case '÷': 
        if(text == "") return
        else if(text[last] == '+' || text[last] == '-' || text[last] == '×' || text[last] == '÷') return
        else
        this.setState({
          calcText: this.state.calcText + operation
        })
    }
  }

  buttonLongPressed(text) {
    if(text == 'DEL') {
      this.setState({
        calcText: "",
        resText: ""
      })
    } else if(text == '=') {
      return
    } else {
      this.setState({
        calcText: this.state.calcText + text
      })
    }
  }

  buttonPressed(text) {

    if (text == 'DEL') {
      const exp = this.state.calcText
      const newExp = exp.substring(0,exp.length-1);

      this.setState({
        calcText: newExp
      })
    } else {
      this.setState({
        calcText: this.state.calcText + text
      })
    }
  }


  render() {

    let nums = [[1,2,3],[4,5,6],[7,8,9],['.',0,'DEL']]
    let rows = []
    for(let i = 0; i < 4; i++) {
      let row = []
      for(let j = 0; j < 3; j++) {
        row.push(<TouchableOpacity onPress = {() => this.buttonPressed(nums[i][j])} 
        onLongPress = {() => this.buttonLongPressed(nums[i][j])} 
        style = {styles.btn}>
          <Text style = {{fontSize: 25, color: this.state.textColor}}>{nums[i][j]}</Text>
        </TouchableOpacity>)
      }
      rows.push(<View style = {styles.row}>{row}</View>)
    }

    let opers = ['÷', '×', '-', '+']
    let cols = []
    for(let i = 0; i < 4; i++) {
      cols.push(<TouchableOpacity onPress = {() => this.operate(opers[i])} style = {styles.btn}>
        <Text style = {{fontSize: 25, color: this.state.textColor}}>{opers[i]}</Text>
      </TouchableOpacity>)
    }

    const scrollEnabled = this.state.screenWidth > width;
    return (
      <SafeAreaView style = {{ flex: 1, backgroundColor: this.state.bgColor}}>
      <View style = {styles.container}>

        <Text onPress = {() => this.darkModeEnable()} style = {{ alignSelf: 'flex-end', fontSize: 20, margin: 10, color: this.state.textColor}}>{this.state.modeText}</Text>

        <View style = {[styles.calculations,{backgroundColor: this.state.bgColor}]}>
          <ScrollView horizontal = 'true'
          ref = {ref => this.scrollView = ref}
          onContentSizeChange= {(contentHeight, contentWidth) => {    
            this.setState({ screenWidth: contentWidth });
            this.scrollView.root.scrollToEnd();
            }}
          showsHorizontalScrollIndicator = 'false'
          scrollEnabled = {scrollEnabled}
          onContentSizeChange = {this.onContentSizeChange}
          contentContainerStyle = {{flexGrow: 1, justifyContent: 'flex-end', alignSelf: 'center'}}>
            <Text style = {{fontSize: 40, color: this.state.textColor}}>
              {this.state.calcText}
            </Text>
          </ScrollView>
        </View>
        <View style = {styles.result}>
          <Text style = {styles.resText}>
          {this.state.resText}
          </Text>
        </View>
        <View style = {styles.buttons}>

          <View style = {[styles.numbers,{backgroundColor: this.state.numColor}]}>
            {rows}
          </View>

          <View style = {[styles.operations,{backgroundColor: this.state.opColor}]}>

            <View style = {styles.col}>
              {cols}
            </View>

            <View style = {[styles.equals,{backgroundColor: this.state.eqColor}]}>
              <TouchableOpacity onPress = {() => this.calculateResult()} onLongPress = {() => this.buttonLongPressed("=")} style = {styles.btn}>
                <Text style = {{fontSize: 25, color: this.state.textColor}}>=</Text>
              </TouchableOpacity>
            </View>
              
          </View>
        </View>
      </View>
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  col: {
    flex: 4,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  equals: {
    flex: 1.5,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  calculations: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 5
  },
  result: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 5
  },
  buttons: {
    flex: 6,
    flexDirection: 'row'
  },
  numbers: {
    flex: 3
  },
  operations: {
    flex: 1
  },
  resText: {
    fontSize: 30,
    color: 'grey'
  }
});
