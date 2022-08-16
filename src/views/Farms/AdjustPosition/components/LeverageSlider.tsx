import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDropDownIcon, Box, Flex, Text } from 'husky-uikit'
import styled from 'styled-components'

interface MoveProps {
  move: number
}

const MoveBox = styled(Box) <MoveProps>`
  margin-left: ${({ move }) => move}px;
  margin-top: -20px;
  margin-bottom: 10px;
  color: #7b3fe4;
`

const makeLongShadow = (color: any, size: any) => {
  let i = 2
  let shadow = `${i}px 0 0 ${size} ${color}`

  for (; i < 856; i++) {
    shadow = `${shadow}, ${i}px 0 0 ${size} ${color}`
  }

  return shadow
}

const RangeInput = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  width: 100%;
  margin: 0;
  height: 32px;

  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, #7b3fe4, #7b3fe4) 100% 50% / 100% 4px no-repeat transparent;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none !important;
    height: 32px;
    width: 28px;

    background-image: url('/images/blueslider.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow('rgb(189,159,242)', '-13px')};
    transition: background-color 150ms;
    &::before {
      height: 32px;
      width: 32px;
      background: red !important;
    }
  }
`

const LeverageSlider = ({
  leverage,
  currentPositionLeverage,
  targetPositionLeverage,
  datalistOptions,
  handleSliderChange
}) => {
  const targetRef = useRef<any>()
  const [moveVal, setMoveVal] = useState({ width: 0, height: 0 })
  const [margin, setMargin] = useState(0)

  useLayoutEffect(() => {
    if (targetRef.current !== null && targetRef.current !== undefined) {
      setMoveVal({
        width: targetRef?.current?.offsetWidth,
        height: targetRef?.current?.offsetHeight,
      })
    }
  }, [targetPositionLeverage])

  useEffect(() => {
    const tt = ((Math.min(targetPositionLeverage, leverage) - 1) / (leverage - 1)) * (moveVal.width - 32)

    setMargin(tt)
  }, [targetPositionLeverage, moveVal.width, leverage])
  
  return (
    <Flex style={{ border: 'none', paddingTop: '5px' }}>
      <Box style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
        <MoveBox move={margin}>
          <Text color="#7B3FE4" bold>
            {targetPositionLeverage.toFixed(2)}x
          </Text>
        </MoveBox>
        <Box ref={targetRef} style={{ width: '100%', position: 'relative' }}>
          <ArrowDropDownIcon
            width={35}
            height={20}
            style={{
              position: 'absolute',
              top: '-8px',
              fill: '#7B3FE4',
              left:
                ((Math.min(currentPositionLeverage, leverage) - 1) / (leverage - 1)) *
                (moveVal.width - 14) -
                10,
            }}
          />
          <RangeInput
            type="range"
            min="1.0"
            max={leverage < currentPositionLeverage ? currentPositionLeverage : leverage}
            step="0.01"
            name="leverage"
            value={targetPositionLeverage}
            onChange={handleSliderChange}
            list="leverage"
            style={{ width: '100%' }}
          />
        </Box>
        <Flex justifyContent="space-between" mt="-22px" mb="10px">
          <div
            className="middle"
            style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
          />
          {targetPositionLeverage < 1.5 ? (
            <div
              style={{
                borderRadius: '50%',
                width: '12px',
                height: '12px',
                background: 'rgb(189,159,242)',
              }}
            />
          ) : (
            <div
              className="middle"
              style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
            />
          )}
          {targetPositionLeverage < 2 ? (
            <div
              style={{
                borderRadius: '50%',
                width: '12px',
                height: '12px',
                background: 'rgb(189,159,242)',
              }}
            />
          ) : (
            <div
              className="middle"
              style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
            />
          )}
          {targetPositionLeverage < 2.5 ? (
            <div
              style={{
                borderRadius: '50%',
                width: '12px',
                height: '12px',
                background: 'rgb(189,159,242)',
              }}
            />
          ) : (
            <div
              className="middle"
              style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
            />
          )}
          <div
            className="middle"
            style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }}
          />
        </Flex>
        <datalist
          style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px' }}
          id="leverage"
        >
          {datalistOptions}
        </datalist>
      </Box>
    </Flex>
  )
}

export default LeverageSlider
