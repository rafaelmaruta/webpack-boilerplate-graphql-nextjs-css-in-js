import React, {Component} from 'react'
import {connect} from 'react-redux'
import './_styles.scss'

class Main extends Component {
  render () {
    const teste = {}

    console.log(teste.teste?.teste?.teste?.teste)

    return (
      <div className='row center-xs'>
        <div styleName='container'>
          Hello World
        </div>
      </div>
    )
  }
}

const mapStateToProps = function (store) {
  return {}
}

export default connect(mapStateToProps)(Main)
