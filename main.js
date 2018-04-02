// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// export const bus = new Vue()

function Family (idx, mother, father, marrDate, children) {
  this.id = idx,
  this.mother = mother,
  this.father = father,
  this.marriageDate = marrDate,
  this.children = children,
  this.parents = [father, mother]
}

function Person (idx, name, dob, dDate, familyId) {
  this.id = idx,
  this.name = name,
  this.dob = dob,
  this.dDate = dDate,
  this.familyId = familyId
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
