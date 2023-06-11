# tse-g14-carga.uy-balanzas

This repository contains the `tse-g14-carga.uy-balanzas` Node.js application, which serves as a peripheral node for the carga.uy server. The application generates automatic vehicle weighings and is built using the Express framework.

## Installation

To get started with the application, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/tse-g14-carga.uy-balanzas.git`
2. Install the dependencies: `npm install`
3. To run the application, use the following command: `npm start`

## Endpoints

**GET /pesajesVehiculo**: Retrieves the weighings for a specific vehicle within a specified date range.

#### Request Parameters

- `vehiculoId` (required): The ID of the vehicle.
- `fechaInicio` (required): The start date of the date range (format: YYYY-MM-DD).
- `fechaFin` (required): The end date of the date range (format: YYYY-MM-DD).

#### Request Headers

- `token` (required): The authentication token.

#### Response

- Success: Returns an array of weighings that match the specified criteria.
- Failure: Returns an error message.

**GET /balanzas**: Retrieves all the balanzas.

#### Request Headers

- `token` (required): The authentication token.

#### Response

- Success: Returns an array of all the balanzas.
- Failure: Returns an error message.


**GET /balanza/:id**: Retrieves a balanza.

#### Request Parameters

- `id` (required): The ID of the balanza.

#### Request Headers

- `token` (required): The authentication token.

#### Response

- Success: Returns the balanza object.
- Failure: Returns an error message.

**POST /balanza**: Creates a new balanza.

#### Request Headers

- `token` (required): The authentication token.

#### Request Body

- `direccion` (required): The address of the balanza.

#### Response

- Success: Returns the newly created balanza object.
- Failure: Returns an error message.


**PUT /balanza/:id**: Updates an existing balanza.

#### Request Parameters

- `id` (required): The ID of the balanza.

#### Request Headers

- `token` (required): The authentication token.

#### Request Body

- `direccion` (required): The updated address of the balanza.

#### Response

- Success: Returns a success message along with the updated balanza object.
- Failure: Returns an error message.


**DELETE /balanza/:id**: Deletes a balanza.

#### Request Parameters

- `id` (required): The ID of the balanza.

#### Request Headers

- `token` (required): The authentication token.

#### Response

- Success: Returns a success message.
- Failure: Returns an error message.

## Dependencies

The application uses the following dependency:

- [Express](https://expressjs.com/): A fast, unopinionated, minimalist web framework for Node.js.
