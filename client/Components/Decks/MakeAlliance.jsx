import React from 'react';
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
import classNames from 'classnames';

import './MakeAlliance.scss';

const MakeAlliance = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
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

    let statsClass = classNames('panel player-stats');

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
            ),
        houseDeck1: yup
            .string()
            .matches(
                /Saurian|Dis|Brobnar|Mars|Star Alliance|Shadows|Unfathomable|Sanctum|Untamed|Logos/,
                t(
                    'The choosen house in invalid. Should be Saurian Dis Brobnar Mars Star Alliance Shadows Unfathomable Sanctum Untamed Logos'
                )
            )
        // houseDeck2: yup
        //     .string()
        //     .matches(
        //         /[123]{1}/,
        //         t('The choosen house in invalid. Should be 1 2 or 3')
        //     ),
        // houseDeck3: yup
        //     .string()
        //     .matches(
        //         /[123]{1}/,
        //         t('The choosen house in invalid. Should be 1 2 or 3')
        //     )
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
                    { uuid: uuid[0], house: house1 },
                    { uuid: uuid2[0], house: house2 },
                    { uuid: uuid3[0], house: house3 }
                )
            );
        }
    };
    const getHouse = (house) => {
        let houseTitle = t(house);
        return houseTitle[0].toUpperCase() + houseTitle.slice(1);
    };

    let house1 = '';
    let house2 = '';
    let house3 = '';

    const getHouses = (formProps, deckNumber) => {
        let houses = Constants.Houses;
        return (
            <div className='state'>
                {houses.map((house) => (
                    <img
                        key={house}
                        onClick={() => {
                            if (deckNumber === 1) {
                                house1 = getHouse(house);
                                formProps.values.houseDeck1 = house1;
                            } else if (deckNumber === 2) {
                                house2 = getHouse(house);
                            } else if (deckNumber === 3) {
                                house3 = getHouse(house);
                            }
                            console.log('Click on ' + house);
                            console.log('for ' + deckNumber);
                        }}
                        className={`img-fluid ${
                            (house1 === getHouse(house) && deckNumber === 1) ||
                            (house2 === getHouse(house) && deckNumber === 2) ||
                            (house3 === getHouse(house) && deckNumber === 3)
                                ? 'active'
                                : 'inactive'
                        }-house`}
                        src={Constants.IdBackHousePaths[house]}
                        title={getHouse(house)}
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
                                        <div className={statsClass}>
                                            <div className='state'>{getHouses(formProps, 1)}</div>
                                        </div>{' '}
                                        <Form.Control
                                            name='houseDeck1'
                                            type='text'
                                            placeholder='Saurian Dis Brobnar Mars Star Alliance Shadows Unfathomable Sanctum Untamed Logos'
                                            value={formProps.values.houseDeck1}
                                            onChange={formProps.handleChange}
                                            onBlur={formProps.handleBlur}
                                            isInvalid={
                                                formProps.touched.houseDeck1 &&
                                                !!formProps.errors.houseDeck1
                                            }
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {formProps.errors.deckLink1}
                                            {formProps.errors.houseDeck1}
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
                                        {getHouses(formProps, 2)}
                                        <Form.Control
                                            name='houseDeck2'
                                            type='text'
                                            placeholder='Saurian Dis Brobnar Mars Star Alliance Shadows Unfathomable Sanctum Untamed Logos'
                                            value={formProps.values.houseDeck2}
                                            onChange={formProps.handleChange}
                                            onBlur={formProps.handleBlur}
                                            isInvalid={
                                                formProps.touched.houseDeck2 &&
                                                !!formProps.errors.houseDeck2
                                            }
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {formProps.errors.deckLink2}
                                            {formProps.errors.houseDeck2}
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
                                        {getHouses(formProps, 3)}
                                        <Form.Control
                                            name='houseDeck3'
                                            type='text'
                                            placeholder='Saurian Dis Brobnar Mars Star Alliance Shadows Unfathomable Sanctum Untamed Logos'
                                            value={formProps.values.houseDeck3}
                                            onChange={formProps.handleChange}
                                            onBlur={formProps.handleBlur}
                                            isInvalid={
                                                formProps.touched.houseDeck3 &&
                                                !!formProps.errors.houseDeck3
                                            }
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {formProps.errors.deckLink3}
                                            {formProps.errors.houseDeck3}
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
