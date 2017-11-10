import React from 'react'
import getParam from 'get-query-param'

import {
  connect
} from 'refunk'

import {
  H1,
  H2,
  Div,
  Pre,
  Flex,
  Loading
} from './library'

import SubHeader from './SubHeader'
import Layout from './Layout'

import SummaryStats from './SummaryStats'
import Declarations from './Declarations'
import Colors from './Colors'
import BackgroundColors from './BackgroundColors'
import FontSizes from './FontSizes'
import FontFamilies from './FontFamilies'
import ZIndexes from './ZIndexes'
import SpacingResets from './SpacingResets'

class Stats extends React.Component {
  constructor (props) {
    super()

    this.state = {
      url: props.url || getParam('url', window.location.href)
    }
  }

  componentDidMount () {
    const url = this.props.url || this.state.url

    fetch(`/api/stats?url=${url}`)
      .then(res => res.json())
      .then(body => this.props.update(body))
      .catch(console.error)
  }

  render () {
    const url = this.props.url || this.state.url

    if (!this.props.css) {
      return (
        <Layout p={[4, 5, 6]}>
          <Flex h={9/10} items='center'>
            <Loading />
            <H2 my={0} pl={3}>
              Downloading and analyzing css from {url}
            </H2>
          </Flex>
        </Layout>
      )
    }

    const {
      css: {
        css,
        pageTitle
      },
      stats: {
        rules,
        humanizedGzipSize,
        declarations,
        selectors
      }
    } = this.props

    const properties = declarations.properties

    const backgroundColors = properties['background-color']
    const colors = properties.color

    return (
      <Layout>
        <SubHeader
          title={pageTitle}
          text={humanizedGzipSize}
        />

        <SummaryStats
          rules={rules.total}
          selectors={selectors.total}
          declarations={declarations.total}
          properties={Object.keys(properties).length}
        />

        <Declarations
          properties={properties}
        />

        <Colors
          title={`${colors.length} unique colors`}
          colors={colors}
        />

        <BackgroundColors
          backgroundColors={backgroundColors}
        />

        <FontSizes
          fontSizes={properties['font-size'] || []}
        />

        <FontFamilies
          fontFamilies={properties['font-family'] || []}
        />

        <ZIndexes
          zIndexes={properties['z-index'] || []}
        />

        <SpacingResets
          properties={properties}
        />

        <Div mt={5}>
          <H2>Raw Css</H2>
          <Pre>{css.trim()}</Pre>
        </Div>
      </Layout>
    )
  }
}

export default connect()(Stats)
