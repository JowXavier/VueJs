Vue.http.options.root = 'http://127.0.0.1:8000/api';

window.Bill = Vue.resource('bills{/id}', {}, {
	total: {method: 'GET', url: 'bills/total'}
});