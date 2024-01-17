export const mockAccountsResponse = {
    "object": "list",
    "data": [
        {
            "id": "acct_1OX4kfLHyrnI77Jq",
            "object": "account",
            "business_profile": {
                "mcc": "1731",
                "name": "Nirvana Energy LLC",
                "support_address": {
                    "city": "Gilbert",
                    "country": "US",
                    "line1": "1077 South Reber Avenue",
                    "line2": null,
                    "postal_code": "85296",
                    "state": "AZ"
                },
                "support_email": null,
                "support_phone": "+16027708419",
                "support_url": null,
                "url": "nirvanaenergy.net"
            },
            "capabilities": {
                "acss_debit_payments": "active",
                "affirm_payments": "inactive",
                "afterpay_clearpay_payments": "active",
                "bancontact_payments": "active",
                "card_payments": "active",
                "cartes_bancaires_payments": "pending",
                "cashapp_payments": "active",
                "eps_payments": "active",
                "giropay_payments": "active",
                "ideal_payments": "active",
                "klarna_payments": "active",
                "link_payments": "active",
                "p24_payments": "active",
                "sepa_debit_payments": "active",
                "transfers": "active",
                "us_bank_account_ach_payments": "active"
            },
            "charges_enabled": true,
            "controller": {
                "is_controller": true,
                "type": "application"
            },
            "country": "US",
            "created": 1704905261,
            "default_currency": "usd",
            "details_submitted": true,
            "email": "zach@nirvanaenergy.net",
            "external_accounts": {
                "object": "list",
                "data": [
                    {
                        "id": "ba_1OX4sJLHyrnI77JqPFG2pQzz",
                        "object": "bank_account",
                        "account": "acct_1OX4kfLHyrnI77Jq",
                        "account_holder_name": null,
                        "account_holder_type": null,
                        "account_type": null,
                        "available_payout_methods": [
                            "standard"
                        ],
                        "bank_name": "JPMORGAN CHASE BANK, NA",
                        "country": "US",
                        "currency": "usd",
                        "default_for_currency": true,
                        "fingerprint": "qYF1P0MnWwEtlhzC",
                        "future_requirements": {
                            "currently_due": [],
                            "errors": [],
                            "past_due": [],
                            "pending_verification": []
                        },
                        "last4": "5509",
                        "metadata": {},
                        "requirements": {
                            "currently_due": [],
                            "errors": [],
                            "past_due": [],
                            "pending_verification": []
                        },
                        "routing_number": "028000121",
                        "status": "verified"
                    }
                ],
                "has_more": false,
                "total_count": 1,
                "url": "/v1/accounts/acct_1OX4kfLHyrnI77Jq/external_accounts"
            },
            "future_requirements": {
                "alternatives": [],
                "current_deadline": null,
                "currently_due": [],
                "disabled_reason": null,
                "errors": [],
                "eventually_due": [],
                "past_due": [],
                "pending_verification": []
            },
            "metadata": {},
            "payouts_enabled": true,
            "requirements": {
                "alternatives": [],
                "current_deadline": null,
                "currently_due": [],
                "disabled_reason": null,
                "errors": [],
                "eventually_due": [
                    "person_1OX4oNLHyrnI77JqZmM3otzk.id_number",
                    "person_1OX4poLHyrnI77JqfTzJdbCi.dob.day",
                    "person_1OX4poLHyrnI77JqfTzJdbCi.dob.month",
                    "person_1OX4poLHyrnI77JqfTzJdbCi.dob.year",
                    "person_1OX4poLHyrnI77JqfTzJdbCi.id_number",
                    "person_1OX4poLHyrnI77JqfTzJdbCi.phone"
                ],
                "past_due": [],
                "pending_verification": []
            },
            "settings": {
                "bacs_debit_payments": {
                    "display_name": null,
                    "service_user_number": null
                },
                "branding": {
                    "icon": null,
                    "logo": "file_1OX4xLIodeKZRLDVWPeNEJbj",
                    "primary_color": "#5964a9",
                    "secondary_color": "#e9d43f"
                },
                "card_issuing": {
                    "tos_acceptance": {
                        "date": null,
                        "ip": null
                    }
                },
                "card_payments": {
                    "decline_on": {
                        "avs_failure": true,
                        "cvc_failure": true
                    },
                    "statement_descriptor_prefix": "NIRVANAENE",
                    "statement_descriptor_prefix_kana": null,
                    "statement_descriptor_prefix_kanji": null
                },
                "dashboard": {
                    "display_name": "nirvanaenergy.net",
                    "timezone": "Etc/UTC"
                },
                "payments": {
                    "statement_descriptor": "NIRVANAENERGY.NET",
                    "statement_descriptor_kana": null,
                    "statement_descriptor_kanji": null
                },
                "payouts": {
                    "debit_negative_balances": true,
                    "schedule": {
                        "delay_days": 2,
                        "interval": "daily"
                    },
                    "statement_descriptor": null
                },
                "sepa_debit_payments": {}
            },
            "tos_acceptance": {
                "date": 1704905255
            },
            "type": "standard"
        },
        {
            "id": "acct_1OWxyuIrfvGMH1pP",
            "object": "account",
            "business_profile": {
                "mcc": null,
                "name": null,
                "product_description": null,
                "support_address": null,
                "support_email": null,
                "support_phone": null,
                "support_url": null,
                "url": null
            },
            "business_type": "individual",
            "capabilities": {
                "affirm_payments": "inactive",
                "bancontact_payments": "inactive",
                "bank_transfer_payments": "inactive",
                "card_payments": "inactive",
                "cashapp_payments": "inactive",
                "eps_payments": "inactive",
                "giropay_payments": "inactive",
                "ideal_payments": "inactive",
                "link_payments": "inactive",
                "p24_payments": "inactive",
                "sepa_debit_payments": "inactive",
                "sofort_payments": "inactive",
                "transfers": "inactive"
            },
            "charges_enabled": false,
            "company": {
                "address": {
                    "city": null,
                    "country": "US",
                    "line1": null,
                    "line2": null,
                    "postal_code": null,
                    "state": null
                },
                "directors_provided": true,
                "executives_provided": true,
                "name": null,
                "owners_provided": true,
                "tax_id_provided": false,
                "verification": {
                    "document": {
                        "back": null,
                        "details": null,
                        "details_code": null,
                        "front": null
                    }
                }
            },
            "country": "US",
            "created": 1704878513,
            "default_currency": "usd",
            "details_submitted": false,
            "email": null,
            "external_accounts": {
                "object": "list",
                "data": [],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/accounts/acct_1OWxyuIrfvGMH1pP/external_accounts"
            },
            "future_requirements": {
                "alternatives": [],
                "current_deadline": 1713294000,
                "currently_due": [
                    "business_profile.mcc",
                    "business_profile.url",
                    "external_account",
                    "individual.address.city",
                    "individual.address.line1",
                    "individual.address.postal_code",
                    "individual.address.state",
                    "individual.dob.day",
                    "individual.dob.month",
                    "individual.dob.year",
                    "individual.email",
                    "individual.first_name",
                    "individual.last_name",
                    "individual.phone",
                    "individual.ssn_last_4",
                    "settings.payments.statement_descriptor"
                ],
                "disabled_reason": null,
                "errors": [],
                "eventually_due": [
                    "business_profile.mcc",
                    "business_profile.url",
                    "external_account",
                    "individual.address.city",
                    "individual.address.line1",
                    "individual.address.postal_code",
                    "individual.address.state",
                    "individual.dob.day",
                    "individual.dob.month",
                    "individual.dob.year",
                    "individual.email",
                    "individual.first_name",
                    "individual.id_number",
                    "individual.last_name",
                    "individual.phone",
                    "individual.ssn_last_4",
                    "settings.payments.statement_descriptor"
                ],
                "past_due": [
                    "business_profile.mcc",
                    "business_profile.url",
                    "external_account",
                    "individual.address.city",
                    "individual.address.line1",
                    "individual.address.postal_code",
                    "individual.address.state",
                    "individual.dob.day",
                    "individual.dob.month",
                    "individual.dob.year",
                    "individual.first_name",
                    "individual.last_name"
                ],
                "pending_verification": []
            },
            "metadata": {},
            "payouts_enabled": false,
            "requirements": {
                "alternatives": [],
                "current_deadline": null,
                "currently_due": [
                    "business_profile.mcc",
                    "business_profile.url",
                    "company.address.city",
                    "company.address.line1",
                    "company.address.postal_code",
                    "company.address.state",
                    "company.name",
                    "company.tax_id",
                    "external_account",
                    "individual.address.city",
                    "individual.address.line1",
                    "individual.address.postal_code",
                    "individual.address.state",
                    "individual.dob.day",
                    "individual.dob.month",
                    "individual.dob.year",
                    "individual.email",
                    "individual.first_name",
                    "individual.last_name",
                    "individual.phone",
                    "individual.ssn_last_4",
                    "settings.payments.statement_descriptor"
                ],
                "disabled_reason": "requirements.past_due",
                "errors": [],
                "eventually_due": [
                    "business_profile.mcc",
                    "business_profile.url",
                    "company.address.city",
                    "company.address.line1",
                    "company.address.postal_code",
                    "company.address.state",
                    "company.name",
                    "company.tax_id",
                    "external_account",
                    "individual.address.city",
                    "individual.address.line1",
                    "individual.address.postal_code",
                    "individual.address.state",
                    "individual.dob.day",
                    "individual.dob.month",
                    "individual.dob.year",
                    "individual.email",
                    "individual.first_name",
                    "individual.id_number",
                    "individual.last_name",
                    "individual.phone",
                    "individual.ssn_last_4",
                    "settings.payments.statement_descriptor"
                ],
                "past_due": [
                    "business_profile.mcc",
                    "business_profile.url",
                    "company.address.city",
                    "company.address.line1",
                    "company.address.postal_code",
                    "company.address.state",
                    "company.name",
                    "company.tax_id",
                    "external_account",
                    "individual.address.city",
                    "individual.address.line1",
                    "individual.address.postal_code",
                    "individual.address.state",
                    "individual.dob.day",
                    "individual.dob.month",
                    "individual.dob.year",
                    "individual.email",
                    "individual.first_name",
                    "individual.last_name",
                    "individual.phone",
                    "individual.ssn_last_4",
                    "settings.payments.statement_descriptor"
                ],
                "pending_verification": []
            },
            "settings": {
                "bacs_debit_payments": {
                    "display_name": null,
                    "service_user_number": null
                },
                "branding": {
                    "icon": null,
                    "logo": "file_1OWxyuIodeKZRLDVn11J7tsR",
                    "primary_color": "#5964a9",
                    "secondary_color": "#e9d43f"
                },
                "card_issuing": {
                    "tos_acceptance": {
                        "date": null,
                        "ip": null
                    }
                },
                "card_payments": {
                    "decline_on": {
                        "avs_failure": false,
                        "cvc_failure": false
                    },
                    "statement_descriptor_prefix": null,
                    "statement_descriptor_prefix_kana": null,
                    "statement_descriptor_prefix_kanji": null
                },
                "dashboard": {
                    "display_name": null,
                    "timezone": "Etc/UTC"
                },
                "payments": {
                    "statement_descriptor": null,
                    "statement_descriptor_kana": null,
                    "statement_descriptor_kanji": null
                },
                "payouts": {
                    "debit_negative_balances": false,
                    "schedule": {
                        "delay_days": 2,
                        "interval": "daily"
                    },
                    "statement_descriptor": null
                },
                "sepa_debit_payments": {}
            },
            "tos_acceptance": {
                "date": 1704878520,
                "ip": "136.38.86.213",
                "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            "type": "custom"
        }
    ],
    "has_more": false,
    "url": "/v1/accounts"
};