import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Col, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';

import Panel from '../Site/Panel';
import ApiStatus from '../Site/ApiStatus';
import { Constants } from '../../constants';
import { Decks } from '../../redux/types';
import { clearApiStatus, navigate, saveAlliance } from '../../redux/actions';

import './MakeAlliance.scss';

const MakeAlliance = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [allianceHouses, setAllianceHouses] = useState({ house1: '', house2: '', house3: '' });
    const handleChangeHouse = (e) => {
        const { name } = e.target;
        const housedeck = 'house' + name.split('_')[1];
        const value = name.split('_')[0];
        setAllianceHouses((prevState) => ({
            ...prevState,
            [housedeck]: value
        }));
    };

    const apiState = useSelector((state) => {
        const retState = state.api[Decks.SaveDeck];

        if (retState && retState.success) {
            retState.message = t('Alliance is successfully forged');
            setTimeout(() => {
                dispatch(clearApiStatus(Decks.SaveDeck));
                dispatch(navigate('/decks'));
            }, 1000);
        }
        return retState;
    });

    const schema = yup.object({
        deckLink1: yup
            .string()
            .required(t('You must specify the deck link'))
            .notOneOf(
                ['https://www.keyforgegame.com/deck-details/00000000-0000-0000-0000-000000000000'],
                t('The URL you entered is invalid.  Please check it and try again.')
            )
            .matches(
                /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
                t('The URL you entered is invalid.  Please check it and try again.')
            ),
        deckLink2: yup
            .string()
            .required(t('You must specify the deck link'))
            .notOneOf(
                ['https://www.keyforgegame.com/deck-details/00000000-0000-0000-0000-000000000000'],
                t('The URL you entered is invalid.  Please check it and try again.')
            )
            .matches(
                /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
                t('The URL you entered is invalid.  Please check it and try again.')
            ),
        deckLink3: yup
            .string()
            .required(t('You must specify the deck link'))
            .notOneOf(
                ['https://www.keyforgegame.com/deck-details/00000000-0000-0000-0000-000000000000'],
                t('The URL you entered is invalid.  Please check it and try again.')
            )
            .matches(
                /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
                t('The URL you entered is invalid.  Please check it and try again.')
            )
    });

    const initialValues = {
        deckLink1: '',
        deckLink2: '',
        deckLink3: ''
    };

    const onSubmit = (values) => {
        const regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
        let uuid = values.deckLink1.match(regex);

        if (values.deckLink1 && values.deckLink2 && values.deckLink3) {
            let uuid2 = values.deckLink2.match(regex);

            let uuid3 = values.deckLink3.match(regex);
            dispatch(
                saveAlliance(
                    { uuid: uuid[0], house: allianceHouses.house1 },
                    { uuid: uuid2[0], house: allianceHouses.house2 },
                    { uuid: uuid3[0], house: allianceHouses.house3 }
                )
            );
        }
    };
    const getHouse = (house) => {
        let houseTitle = t(house);
        return houseTitle[0].toUpperCase() + houseTitle.slice(1);
    };

    let houses1 = Constants.Houses.map((houseCode) => houseCode);
    let houses2 = Constants.Houses.map((houseCode) => houseCode);
    let houses3 = Constants.Houses.map((houseCode) => houseCode);

    const getHouses = (availableHouses, deckNumber) => {
        return (
            <div className='state'>
                {/* {Array.from(thisDeckHousesMap.keys()).map((houseCodeLoop) => ( */}
                {availableHouses.map((houseCodeLoop) => (
                    <img
                        key={houseCodeLoop + '_' + deckNumber}
                        name={houseCodeLoop + '_' + deckNumber}
                        onClick={handleChangeHouse}
                        className={`img-fluid ${
                            allianceHouses['house' + deckNumber] === houseCodeLoop
                                ? 'active'
                                : 'inactive'
                        }-house`}
                        src={Constants.IdBackHousePaths[houseCodeLoop]}
                        title={getHouse(houseCodeLoop)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <Col md={{ span: 8, offset: 2 }} className='profile full-height'>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Decks.SaveDeck))}
                />
                <Panel title={t('Make Alliance')}>
                    <Trans i18nKey='makeallicance.enterlink'>
                        <p>
                            Enter the deck link from the&nbsp;
                            <a
                                href='https://keyforgegame.com'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                keyforge website.
                            </a>
                        </p>
                        <p>
                            Either search for a deck, or find one from the &quot;My Decks&quot;
                            section of the website. Find the URL of the deck and paste it in to the
                            box below.
                        </p>
                        <p>The URL looks like this: </p>
                    </Trans>
                    <p>
                        <code>
                            https://www.keyforgegame.com/deck-details/00000000-0000-0000-0000-000000000000
                        </code>
                    </p>
                    <Formik
                        validationSchema={schema}
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                    >
                        {(formProps) => (
                            <Form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    formProps.handleSubmit(event);
                                }}
                            >
                                <Form.Row>
                                    <Form.Group as={Col} xs='9' controlId='formGridDeckLink'>
                                        <Form.Label>{t('Alliance deck 1')}</Form.Label>
                                        <Form.Control
                                            name='deckLink1'
                                            type='text'
                                            placeholder={t('Enter the deck link')}
                                            value={formProps.values.deckLink1}
                                            onChange={formProps.handleChange}
                                            onBlur={formProps.handleBlur}
                                            isInvalid={
                                                formProps.touched.deckLink1 &&
                                                !!formProps.errors.deckLink1
                                            }
                                        />
                                        {getHouses(houses1, 1)}
                                        <Form.Control.Feedback type='invalid'>
                                            {formProps.errors.deckLink1}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} xs='9' controlId='formGridDeckLink2'>
                                        <Form.Label>{t('Deck link Alliance House 2')}</Form.Label>
                                        <Form.Control
                                            name='deckLink2'
                                            type='text'
                                            placeholder={t('Enter the deck link')}
                                            value={formProps.values.deckLink2}
                                            onChange={formProps.handleChange}
                                            onBlur={formProps.handleBlur}
                                            isInvalid={
                                                formProps.touched.deckLink2 &&
                                                !!formProps.errors.deckLink2
                                            }
                                        />
                                        {getHouses(houses2, 2)}
                                        <Form.Control.Feedback type='invalid'>
                                            {formProps.errors.deckLink2}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} xs='9' controlId='formGridDeckLink3'>
                                        <Form.Label>{t('Deck Link Alliance house 3')}</Form.Label>
                                        <Form.Control
                                            name='deckLink3'
                                            type='text'
                                            placeholder={t('Enter the deck link')}
                                            value={formProps.values.deckLink3}
                                            onChange={formProps.handleChange}
                                            onBlur={formProps.handleBlur}
                                            isInvalid={
                                                formProps.touched.deckLink3 &&
                                                !!formProps.errors.deckLink3
                                            }
                                        />
                                        {getHouses(houses3, 3)}
                                        <Form.Control.Feedback type='invalid'>
                                            {formProps.errors.deckLink3}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Col className='text-center'>
                                    <Button variant='secondary' type='submit'>
                                        {t('Import')}
                                        &nbsp;
                                        {apiState && apiState.loading && (
                                            <FontAwesomeIcon icon={faCircleNotch} spin />
                                        )}
                                    </Button>
                                </Col>
                            </Form>
                        )}
                    </Formik>
                </Panel>
            </Col>
        </div>
    );
};

MakeAlliance.displayName = 'MakeAlliance';

export default MakeAlliance;
