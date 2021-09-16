import React, {Component, ReactElement} from "react"
import {CSSTransition} from "react-transition-group"
import "../styles/Carousel.scss"
import arrowLeft from "../assets/images/arrow-left.png"
import arrowRight from "../assets/images/arrow-right.png"
import indicatorFull from "../assets/images/indicator-full.png"
import indicatorEmpty from "../assets/images/indicator-empty.png"

interface IProps {
    children: Array<IChild>
    transitionTimeout: number
}

type IChild = ReactElement<HTMLImageElement>

interface IState {
    children: Array<(IChild)>
    currentImage: IChild
    currentIndex: number
}

export default class Carousel extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        const {children} = this.props
        this.state = {
            children: children,
            currentImage: children[0],
            currentIndex: 0
        }
    }

    componentDidMount() {
        this.state.children.forEach(el => {
            new Image().src = el.props.src
        })
    }

    static defaultProps = {
        transitionTimeout: 0,
    }
    nextImage = () => {
        const {currentIndex, children} = this.state
        const newIndex = (currentIndex + 1) % children.length

        this.setState({
            currentImage: children[newIndex],
            currentIndex: newIndex
        })
    }
    prevImage = () => {
        const {currentIndex, children} = this.state
        const newIndex = (currentIndex - 1 + children.length) % children.length

        this.setState({
            currentImage: children[newIndex],
            currentIndex: newIndex
        })
    }

    render() {
        const {currentImage, currentIndex} = this.state
        const childrenCount = this.state.children.length
        const indicators = [...Array(childrenCount)].map((__, i) => {
                return (i === currentIndex) ?
                    <img src={indicatorFull} alt={"Indicator full"}/> :
                    <img src={indicatorEmpty} alt={"Indicator empty"}/>
            }
        )

        return (

            <div className={"carousel"}>
                <CSSTransition
                    key={currentIndex}
                    in={true}
                    appear={true}
                    timeout={1000}
                    classNames={"fade"}
                >
                    {currentImage}
                </CSSTransition>
                {childrenCount !== 1 &&
                <div className={"controls"}>
                    <div className={"arrows"}>
                        <img src={arrowLeft} alt={"Arrow left"} onClick={this.prevImage}/>
                        <img src={arrowRight} alt={"Arrow right"} onClick={this.nextImage}/>
                    </div>
                    <div className={"indicators"}>
                        {indicators}
                    </div>
                </div>
                }
            </div>
        )
    }
}