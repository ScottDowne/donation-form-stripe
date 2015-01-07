
var express = require('express');
var path = require('path');

var stripeKeys = {
  publishableKey: 'pk_test_BZ0QTIwe7BVAk1ZDxOgWZ9Z6',
  secretKey: 'sk_test_HbsdaR1Bn5I84vdezKa9VcvA' // add to charge.js
}

var stripe = require('stripe')(stripeKeys.secretKey);
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

app.get('/stripe',
  function(req,res){
    // add a page here indicating that there is nothing to see
    res.send("Scram!");
  }
);

app.post('/stripe',
  function(req,res) {
    // obtain StripeToken
    var transaction = req.body;

    var stripeToken = transaction.stripeToken;
    // create charge

    var charge = {
      // stripe works in cents
      amount: transaction.amount_other * 100,
      currency: 'USD',
      card: stripeToken
    };
    stripe.charges.create(charge,
      function(err, charge) {
        if (err) {
          console.log(err);
        } else {
          res.json(charge);
          console.log('Successful charge sent to Stripe!');
        }
      }       
    );
  }
);

app.listen(2015, function(){
  console.log('\nExpress server listening on port 2015');
});
