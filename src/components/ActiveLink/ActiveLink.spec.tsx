import { render } from "@testing-library/react"
import { ActiveLink } from "."

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('test', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText('Home')).toBeInTheDocument()
  })

  it('adds active class when link is active', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText('Home')).toHaveClass('active')
  })
})