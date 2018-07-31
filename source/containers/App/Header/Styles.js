import { css } from 'react-emotion'
import { Color, mobileMaxWidth, desktopMinWidth } from 'constants/css'

export const container = css`
  z-index: 500;
  font-family: 'Helvetica Neue', Helvetica, 'Liberation Sans', Arial, sans-serif;
  font-size: 1.5rem;
  background: #fff;
  display: flex;
  box-shadow: 0 3px 3px -3px ${Color.menuGray()};
  align-items: center;
  width: 100%;
  margin-bottom: 0px;
  height: 6rem;

  .header-nav {
    display: flex;
    margin-right: 2rem;
    .chat {
      color: ${Color.menuGray()};
    }
    a {
      text-decoration: none;
      margin-left: 0.5rem;
      color: ${Color.menuGray()};
      .icon {
        line-height: 1.7rem;
        margin-right: 0.7rem;
        display: flex;
        align-items: center;
      }
    }
    a.active {
      font-weight: bold;
      color: ${Color.black()};
      span.no-hover {
        color: ${Color.menuGray()};
      }
    }
    &:hover {
      a {
        span {
          color: ${Color.black()};
        }
      }
    }
    @media (max-width: ${mobileMaxWidth}) {
      width: 100%;
      justify-content: center;
      font-size: 4rem;
      a {
        .nav-label {
          display: none;
        }
      }
      &:hover {
        a {
          span {
            color: ${Color.menuGray()};
          }
        }
        a.active {
          color: ${Color.black()};
          span {
            color: ${Color.black()};
          }
        }
      }
    }
  }

  > .main-tabs {
    width: 80%;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: ${mobileMaxWidth}) {
      padding: 0;
      width: 100%;
    }
  }

  > .chat-bar {
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 1s;
    &:hover {
      background: ${Color.lightBlue()};
      color: #fff;
    }
    @media (max-width: ${mobileMaxWidth}) {
      font-size: 3rem;
      &:hover {
        background: #fff;
        color: #000;
      }
    }
  }

  @media (min-width: ${desktopMinWidth}) {
    top: 0;
  }
  @media (max-width: ${mobileMaxWidth}) {
    bottom: 0;
    height: 9rem;
    border-top: 1px solid ${Color.borderGray()};
  }
`

export const logo = {
  outer: `desktop ${css`
    position: relative;
    margin-left: 1rem;
    width: 10rem;
    height: 2rem;
  `}`,
  inner: css`
    font-size: 2rem;
    font-weight: bold;
    line-height: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    margin: 0;
    text-decoration: none;
    line-height: 0.9;
    color: ${Color.menuGray()};
    &:hover {
      > .logo-twin {
        color: ${Color.logoBlue()};
      }
      > .logo-kle {
        color: ${Color.logoGreen()};
      }
    }
    &.active {
      > .logo-twin {
        color: ${Color.logoBlue()};
      }
      > .logo-kle {
        color: ${Color.logoGreen()};
      }
    }
  `
}
