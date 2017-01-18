var router = new VueRouter();

router.map({
	'/bill-pays': {
		component: billPayComponent,
		subRoutes: {
			'/': {
				name: 'bill-pay.list', 
				component: billPayListComponent
			},
			'/create': {
				name: 'bill-pay.create',
				component: billPayCreateComponent
			},
			'/:id/update': {
				name: 'bill-pay.update',
				component: billPayCreateComponent
			}
		}
	},
	'*': {
		component: billPayListComponent
	},
	'bill-receives': {
		name: 'bill-receive',
		component: billReceiveComponent
	}
});

router.start({
	components: {
		'bill-component': billComponent
	}
}, '#app');

router.redirect({
	'*': '/bill-pays'
});