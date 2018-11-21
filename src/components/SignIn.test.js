import { mount } from '@vue/test-utils'
import SignIn from './SignIn'

describe('SignIn component', () => {
  it('SignIn component render correctly', () => {
    const wrapper = mount(SignIn)
    expect(wrapper).toMatchSnapshot()
  })
  it('SignIn should not have props', () => {
    const wrapper = mount(SignIn)
    expect(Object.keys(wrapper.props()).length).toBe(0)
  })
  it('SignIn should contain button sign in', () => {
    const wrapper = mount(SignIn)
    expect(wrapper.html()).toContain('<button type="submit" class="btn pulse">Sign In</button>')
  })
  it('SignIn should have data pass and mail', () => {
    const wrapper = mount(SignIn)
    expect(wrapper.vm.mail).toBe('')
    expect(wrapper.vm.pass).toBe('')
  })
  it('SignIn should have button signInWithGoogle with text Sign In with Google', () => {
    const wrapper = mount(SignIn)
    const btnSignInWithGoogle = wrapper.find('.sign-in-with-google')
    expect(btnSignInWithGoogle.exists()).toBe(true)
    expect(btnSignInWithGoogle.text()).toBe('Sign In With Google')
  })
})
