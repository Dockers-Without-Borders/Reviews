# Reviews

Reviews is a Javascript application part of 

## Installation

Use the package manager npm to install depenedencies.

```bash
npm install
```

## API

### Create
 - Add a review to the list of reviews
   - **POST /restaurantReview**

 - In request body provide key/value pairs: 
   - username: [String]
   - text: [String]
   - photo-urls [String, String, ...]

### Read
 - Get the list of reviews for a restaurant
   - **GET /restaurantReviews**

### Update
```Javascript
Put request to '/restaurantReview'
```

### Delete
```Javascript
Delete  request to '/restaurantReview'
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)