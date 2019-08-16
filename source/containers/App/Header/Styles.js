import { css } from 'emotion';
import { Color, mobileMaxWidth, desktopMinWidth } from 'constants/css';

export const container = css`
  z-index: 30000;
  position: relative;
  font-family: sans-serif, Arial, Helvetica;
  font-size: 1.5rem;
  background: #fff;
  display: flex;
  box-shadow: 0 3px 3px -3px ${Color.black(0.6)};
  align-items: center;
  width: 100%;
  margin-bottom: 0px;
  height: 5rem;

  .header-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    .chat {
      color: ${Color.gray()};
    }
    a {
      text-decoration: none;
      font-weight: bold;
      color: ${Color.gray()};
      align-items: center;
      line-height: 1;
    }
    a.active {
      color: ${Color.black()};
    }
    &:hover {
      > a {
        > svg {
          color: ${Color.black()};
        }
        color: ${Color.black()};
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
      > a.active {
        > svg {
          color: ${Color.black()}!important;
        }
      }
      &:hover {
        > a {
          > svg {
            color: ${Color.gray()};
          }
        }
      }
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
`;
