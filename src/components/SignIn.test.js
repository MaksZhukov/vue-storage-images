import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import SignIn from './SignIn'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('SignIn component', () => {
  it('SignIn component render correctly', () => {
    const wrapper = shallowMount(SignIn)
    expect(wrapper).toMatchSnapshot()
  })
  it('SignIn should not have props', () => {
    const wrapper = shallowMount(SignIn)
    expect(Object.keys(wrapper.props()).length).toBe(0)
  })
  it('SignIn should contain button sign in', () => {
    const wrapper = shallowMount(SignIn)
    expect(wrapper.html()).toContain('<button type="submit" class="btn pulse">Sign In</button>')
  })
  it('SignIn should have data pass and mail', () => {
    const wrapper = shallowMount(SignIn)
    expect(wrapper.vm.mail).toBe('')
    expect(wrapper.vm.pass).toBe('')
  })
  it('SignIn should have button signInWithGoogle with text Sign In with Google', () => {
    const wrapper = shallowMount(SignIn)
    const btnSignInWithGoogle = wrapper.find('.sign-in-with-google')
    expect(btnSignInWithGoogle.exists()).toBe(true)
    expect(btnSignInWithGoogle.text()).toBe('Sign In With Google')
  })
  it('SignIn should have involved actions signIn and signInWithGoogle', () => {
    let actions
    let store

    actions = {
      signIn: jest.fn(),
      signInWithGoogle: jest.fn()
    }

    store = new Vuex.Store({
      modules: {
        userModule: {
          namespaced: true,
          actions
        }
      }
    })
    const wrapper = shallowMount(SignIn, {store, localVue})
    const btnGoogle = wrapper.find('.sign-in-with-google')
    btnGoogle.trigger('click')
    const btnSubmit = wrapper.find('button[type="submit"]')
    btnSubmit.trigger('submit')
    expect(actions.signInWithGoogle).toHaveBeenCalled()
    expect(actions.signIn).toHaveBeenCalled()
  })
})
