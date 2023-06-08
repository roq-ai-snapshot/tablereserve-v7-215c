import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createTableReservation } from 'apiSdk/table-reservations';
import { Error } from 'components/error';
import { tableReservationValidationSchema } from 'validationSchema/table-reservations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RestaurantInterface } from 'interfaces/restaurant';
import { UserInterface } from 'interfaces/user';
import { getRestaurants } from 'apiSdk/restaurants';
import { getUsers } from 'apiSdk/users';
import { TableReservationInterface } from 'interfaces/table-reservation';

function TableReservationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TableReservationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTableReservation(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TableReservationInterface>({
    initialValues: {
      reservation_date: new Date(new Date().toDateString()),
      reservation_time: new Date(new Date().toDateString()),
      number_of_guests: 0,
      created_at: new Date(new Date().toDateString()),
      updated_at: new Date(new Date().toDateString()),
      restaurant_id: (router.query.restaurant_id as string) ?? null,
      customer_id: (router.query.customer_id as string) ?? null,
    },
    validationSchema: tableReservationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Table Reservation
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="reservation_date" mb="4">
            <FormLabel>Reservation Date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.reservation_date}
              onChange={(value: Date) => formik.setFieldValue('reservation_date', value)}
            />
          </FormControl>
          <FormControl id="reservation_time" mb="4">
            <FormLabel>Reservation Time</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.reservation_time}
              onChange={(value: Date) => formik.setFieldValue('reservation_time', value)}
            />
          </FormControl>
          <FormControl id="number_of_guests" mb="4" isInvalid={!!formik.errors?.number_of_guests}>
            <FormLabel>Number Of Guests</FormLabel>
            <NumberInput
              name="number_of_guests"
              value={formik.values?.number_of_guests}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('number_of_guests', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.number_of_guests && <FormErrorMessage>{formik.errors?.number_of_guests}</FormErrorMessage>}
          </FormControl>
          <FormControl id="created_at" mb="4">
            <FormLabel>Created At</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.created_at}
              onChange={(value: Date) => formik.setFieldValue('created_at', value)}
            />
          </FormControl>
          <FormControl id="updated_at" mb="4">
            <FormLabel>Updated At</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.updated_at}
              onChange={(value: Date) => formik.setFieldValue('updated_at', value)}
            />
          </FormControl>
          <AsyncSelect<RestaurantInterface>
            formik={formik}
            name={'restaurant_id'}
            label={'Select Restaurant'}
            placeholder={'Select Restaurant'}
            fetcher={getRestaurants}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'customer_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'table_reservation',
  operation: AccessOperationEnum.CREATE,
})(TableReservationCreatePage);
