const idlFactory$5 = ({ IDL: Ae }) => {
    const Ue = Ae.Rec()
        , Ye = Ae.Rec()
        , Xe = Ae.Rec()
        , Je = Ae.Rec()
        , sr = Ae.Record({
            num_blocks_to_archive: Ae.Opt(Ae.Nat64),
            max_transactions_per_response: Ae.Opt(Ae.Nat64),
            trigger_threshold: Ae.Opt(Ae.Nat64),
            more_controller_ids: Ae.Opt(Ae.Vec(Ae.Principal)),
            max_message_size_bytes: Ae.Opt(Ae.Nat64),
            cycles_for_archive_creation: Ae.Opt(Ae.Nat64),
            node_max_memory_size_bytes: Ae.Opt(Ae.Nat64),
            controller_id: Ae.Opt(Ae.Principal)
        })
        , pr = Ae.Variant({
            Int: Ae.Int,
            Nat: Ae.Nat,
            Blob: Ae.Vec(Ae.Nat8),
            Text: Ae.Text
        })
        , gr = Ae.Record({
            owner: Ae.Principal,
            subaccount: Ae.Opt(Ae.Vec(Ae.Nat8))
        })
        , Ar = Ae.Variant({
            SetTo: gr,
            Unset: Ae.Null
        })
        , qr = Ae.Record({
            icrc2: Ae.Bool
        })
        , Ao = Ae.Record({
            change_archive_options: Ae.Opt(sr),
            token_symbol: Ae.Opt(Ae.Text),
            transfer_fee: Ae.Opt(Ae.Nat),
            metadata: Ae.Opt(Ae.Vec(Ae.Tuple(Ae.Text, pr))),
            accounts_overflow_trim_quantity: Ae.Opt(Ae.Nat64),
            change_fee_collector: Ae.Opt(Ar),
            max_memo_length: Ae.Opt(Ae.Nat16),
            token_name: Ae.Opt(Ae.Text),
            feature_flags: Ae.Opt(qr)
        })
        , pa = Ae.Record({
            num_blocks_to_archive: Ae.Nat64,
            max_transactions_per_response: Ae.Opt(Ae.Nat64),
            trigger_threshold: Ae.Nat64,
            more_controller_ids: Ae.Opt(Ae.Vec(Ae.Principal)),
            max_message_size_bytes: Ae.Opt(Ae.Nat64),
            cycles_for_archive_creation: Ae.Opt(Ae.Nat64),
            node_max_memory_size_bytes: Ae.Opt(Ae.Nat64),
            controller_id: Ae.Principal
        })
        , ga = Ae.Record({
            decimals: Ae.Opt(Ae.Nat8),
            token_symbol: Ae.Text,
            transfer_fee: Ae.Nat,
            metadata: Ae.Vec(Ae.Tuple(Ae.Text, pr)),
            minting_account: gr,
            initial_balances: Ae.Vec(Ae.Tuple(gr, Ae.Nat)),
            maximum_number_of_accounts: Ae.Opt(Ae.Nat64),
            accounts_overflow_trim_quantity: Ae.Opt(Ae.Nat64),
            fee_collector_account: Ae.Opt(gr),
            archive_options: pa,
            max_memo_length: Ae.Opt(Ae.Nat16),
            token_name: Ae.Text,
            feature_flags: Ae.Opt(qr)
        });
    Ae.Variant({
        Upgrade: Ae.Opt(Ao),
        Init: ga
    });
    const Nl = Ae.Record({
        block_range_end: Ae.Nat,
        canister_id: Ae.Principal,
        block_range_start: Ae.Nat
    })
        , $l = Ae.Record({
            start: Ae.Nat,
            length: Ae.Nat
        });
    Je.fill(Ae.Vec(Ae.Variant({
        Int: Ae.Int,
        Map: Ae.Vec(Ae.Tuple(Ae.Text, Xe)),
        Nat: Ae.Nat,
        Nat64: Ae.Nat64,
        Blob: Ae.Vec(Ae.Nat8),
        Text: Ae.Text,
        Array: Je
    }))),
        Xe.fill(Ae.Variant({
            Int: Ae.Int,
            Map: Ae.Vec(Ae.Tuple(Ae.Text, Xe)),
            Nat: Ae.Nat,
            Nat64: Ae.Nat64,
            Blob: Ae.Vec(Ae.Nat8),
            Text: Ae.Text,
            Array: Je
        }));
    const Bl = Ae.Record({
        blocks: Ae.Vec(Xe)
    })
        , Lu = Ae.Record({
            callback: Ae.Func([$l], [Bl], ["query"]),
            start: Ae.Nat,
            length: Ae.Nat
        })
        , kf = Ae.Record({
            certificate: Ae.Opt(Ae.Vec(Ae.Nat8)),
            first_index: Ae.Nat,
            blocks: Ae.Vec(Xe),
            chain_length: Ae.Nat64,
            archived_blocks: Ae.Vec(Lu)
        })
        , Hu = Ae.Record({
            certificate: Ae.Opt(Ae.Vec(Ae.Nat8)),
            hash_tree: Ae.Vec(Ae.Nat8)
        })
        , Ah = Ae.Record({
            from: gr,
            memo: Ae.Opt(Ae.Vec(Ae.Nat8)),
            created_at_time: Ae.Opt(Ae.Nat64),
            amount: Ae.Nat,
            spender: Ae.Opt(gr)
        })
        , tM = Ae.Record({
            to: gr,
            memo: Ae.Opt(Ae.Vec(Ae.Nat8)),
            created_at_time: Ae.Opt(Ae.Nat64),
            amount: Ae.Nat
        })
        , nM = Ae.Record({
            fee: Ae.Opt(Ae.Nat),
            from: gr,
            memo: Ae.Opt(Ae.Vec(Ae.Nat8)),
            created_at_time: Ae.Opt(Ae.Nat64),
            amount: Ae.Nat,
            expected_allowance: Ae.Opt(Ae.Nat),
            expires_at: Ae.Opt(Ae.Nat64),
            spender: gr
        })
        , oM = Ae.Record({
            to: gr,
            fee: Ae.Opt(Ae.Nat),
            from: gr,
            memo: Ae.Opt(Ae.Vec(Ae.Nat8)),
            created_at_time: Ae.Opt(Ae.Nat64),
            amount: Ae.Nat,
            spender: Ae.Opt(gr)
        })
        , fM = Ae.Record({
            burn: Ae.Opt(Ah),
            kind: Ae.Text,
            mint: Ae.Opt(tM),
            approve: Ae.Opt(nM),
            timestamp: Ae.Nat64,
            transfer: Ae.Opt(oM)
        })
        , rM = Ae.Record({
            transactions: Ae.Vec(fM)
        })
        , sM = Ae.Record({
            callback: Ae.Func([$l], [rM], ["query"]),
            start: Ae.Nat,
            length: Ae.Nat
        })
        , cM = Ae.Record({
            first_index: Ae.Nat,
            log_length: Ae.Nat,
            transactions: Ae.Vec(fM),
            archived_transactions: Ae.Vec(sM)
        })
        , ju = Ae.Record({
            url: Ae.Text,
            name: Ae.Text
        })
        , kr = Ae.Record({
            to: gr,
            fee: Ae.Opt(Ae.Nat),
            memo: Ae.Opt(Ae.Vec(Ae.Nat8)),
            from_subaccount: Ae.Opt(Ae.Vec(Ae.Nat8)),
            created_at_time: Ae.Opt(Ae.Nat64),
            amount: Ae.Nat
        })
        , ha = Ae.Variant({
            GenericError: Ae.Record({
                message: Ae.Text,
                error_code: Ae.Nat
            }),
            TemporarilyUnavailable: Ae.Null,
            BadBurn: Ae.Record({
                min_burn_amount: Ae.Nat
            }),
            Duplicate: Ae.Record({
                duplicate_of: Ae.Nat
            }),
            BadFee: Ae.Record({
                expected_fee: Ae.Nat
            }),
            CreatedInFuture: Ae.Record({
                ledger_time: Ae.Nat64
            }),
            TooOld: Ae.Null,
            InsufficientFunds: Ae.Record({
                balance: Ae.Nat
            })
        })
        , ma = Ae.Variant({
            Ok: Ae.Nat,
            Err: ha
        })
        , Tl = Ae.Record({
            utc_offset_minutes: Ae.Opt(Ae.Int16),
            language: Ae.Text
        })
        , Il = Ae.Variant({
            GenericDisplay: Ae.Null,
            LineDisplay: Ae.Record({
                characters_per_line: Ae.Nat16,
                lines_per_page: Ae.Nat16
            })
        })
        , Mu = Ae.Record({
            metadata: Tl,
            device_spec: Ae.Opt(Il)
        })
        , Du = Ae.Record({
            arg: Ae.Vec(Ae.Nat8),
            method: Ae.Text,
            user_preferences: Mu
        })
        , Hl = Ae.Record({
            lines: Ae.Vec(Ae.Text)
        })
        , ko = Ae.Variant({
            LineDisplayMessage: Ae.Record({
                pages: Ae.Vec(Hl)
            }),
            GenericDisplayMessage: Ae.Text
        })
        , Ru = Ae.Record({
            metadata: Tl,
            consent_message: ko
        })
        , eM = Ae.Record({
            description: Ae.Text
        })
        , iM = Ae.Variant({
            GenericError: Ae.Record({
                description: Ae.Text,
                error_code: Ae.Nat
            }),
            InsufficientPayment: eM,
            UnsupportedCanisterCall: eM,
            ConsentMessageUnavailable: eM
        })
        , aM = Ae.Variant({
            Ok: Ru,
            Err: iM
        })
        , AM = Ae.Record({
            account: gr,
            spender: gr
        })
        , NM = Ae.Record({
            allowance: Ae.Nat,
            expires_at: Ae.Opt(Ae.Nat64)
        })
        , yM = Ae.Record({
            fee: Ae.Opt(Ae.Nat),
            memo: Ae.Opt(Ae.Vec(Ae.Nat8)),
            from_subaccount: Ae.Opt(Ae.Vec(Ae.Nat8)),
            created_at_time: Ae.Opt(Ae.Nat64),
            amount: Ae.Nat,
            expected_allowance: Ae.Opt(Ae.Nat),
            expires_at: Ae.Opt(Ae.Nat64),
            spender: gr
        })
        , bM = Ae.Variant({
            GenericError: Ae.Record({
                message: Ae.Text,
                error_code: Ae.Nat
            }),
            TemporarilyUnavailable: Ae.Null,
            Duplicate: Ae.Record({
                duplicate_of: Ae.Nat
            }),
            BadFee: Ae.Record({
                expected_fee: Ae.Nat
            }),
            AllowanceChanged: Ae.Record({
                current_allowance: Ae.Nat
            }),
            CreatedInFuture: Ae.Record({
                ledger_time: Ae.Nat64
            }),
            TooOld: Ae.Null,
            Expired: Ae.Record({
                ledger_time: Ae.Nat64
            }),
            InsufficientFunds: Ae.Record({
                balance: Ae.Nat
            })
        })
        , SM = Ae.Variant({
            Ok: Ae.Nat,
            Err: bM
        })
        , hM = Ae.Record({
            to: gr,
            fee: Ae.Opt(Ae.Nat),
            spender_subaccount: Ae.Opt(Ae.Vec(Ae.Nat8)),
            from: gr,
            memo: Ae.Opt(Ae.Vec(Ae.Nat8)),
            created_at_time: Ae.Opt(Ae.Nat64),
            amount: Ae.Nat
        })
        , mM = Ae.Variant({
            GenericError: Ae.Record({
                message: Ae.Text,
                error_code: Ae.Nat
            }),
            TemporarilyUnavailable: Ae.Null,
            InsufficientAllowance: Ae.Record({
                allowance: Ae.Nat
            }),
            BadBurn: Ae.Record({
                min_burn_amount: Ae.Nat
            }),
            Duplicate: Ae.Record({
                duplicate_of: Ae.Nat
            }),
            BadFee: Ae.Record({
                expected_fee: Ae.Nat
            }),
            CreatedInFuture: Ae.Record({
                ledger_time: Ae.Nat64
            }),
            TooOld: Ae.Null,
            InsufficientFunds: Ae.Record({
                balance: Ae.Nat
            })
        })
        , pM = Ae.Variant({
            Ok: Ae.Nat,
            Err: mM
        })
        , EM = Ae.Record({
            from: Ae.Opt(Ae.Principal)
        })
        , IM = Ae.Record({
            end: Ae.Nat,
            canister_id: Ae.Principal,
            start: Ae.Nat
        });
    Ye.fill(Ae.Variant({
        Int: Ae.Int,
        Map: Ae.Vec(Ae.Tuple(Ae.Text, Ye)),
        Nat: Ae.Nat,
        Blob: Ae.Vec(Ae.Nat8),
        Text: Ae.Text,
        Array: Ae.Vec(Ye)
    }));
    const jM = Ae.Record({
        id: Ae.Nat,
        block: Ye
    })
        , PM = Ae.Record({
            args: Ae.Vec($l),
            callback: Ae.Func([Ae.Vec($l)], [Ue], ["query"])
        });
    Ue.fill(Ae.Record({
        log_length: Ae.Nat,
        blocks: Ae.Vec(jM),
        archived_blocks: Ae.Vec(PM)
    }));
    const zM = Ae.Record({
        certificate: Ae.Vec(Ae.Nat8),
        hash_tree: Ae.Vec(Ae.Nat8)
    })
        , CM = Ae.Record({
            url: Ae.Text,
            block_type: Ae.Text
        });
    return Ae.Service({
        archives: Ae.Func([], [Ae.Vec(Nl)], ["query"]),
        get_blocks: Ae.Func([$l], [kf], ["query"]),
        get_data_certificate: Ae.Func([], [Hu], ["query"]),
        get_transactions: Ae.Func([$l], [cM], ["query"]),
        icrc10_supported_standards: Ae.Func([], [Ae.Vec(ju)], ["query"]),
        icrc1_balance_of: Ae.Func([gr], [Ae.Nat], ["query"]),
        icrc1_decimals: Ae.Func([], [Ae.Nat8], ["query"]),
        icrc1_fee: Ae.Func([], [Ae.Nat], ["query"]),
        icrc1_metadata: Ae.Func([], [Ae.Vec(Ae.Tuple(Ae.Text, pr))], ["query"]),
        icrc1_minting_account: Ae.Func([], [Ae.Opt(gr)], ["query"]),
        icrc1_name: Ae.Func([], [Ae.Text], ["query"]),
        icrc1_supported_standards: Ae.Func([], [Ae.Vec(ju)], ["query"]),
        icrc1_symbol: Ae.Func([], [Ae.Text], ["query"]),
        icrc1_total_supply: Ae.Func([], [Ae.Nat], ["query"]),
        icrc1_transfer: Ae.Func([kr], [ma], []),
        icrc21_canister_call_consent_message: Ae.Func([Du], [aM], []),
        icrc2_allowance: Ae.Func([AM], [NM], ["query"]),
        icrc2_approve: Ae.Func([yM], [SM], []),
        icrc2_transfer_from: Ae.Func([hM], [pM], []),
        icrc3_get_archives: Ae.Func([EM], [Ae.Vec(IM)], ["query"]),
        icrc3_get_blocks: Ae.Func([Ae.Vec($l)], [Ue], ["query"]),
        icrc3_get_tip_certificate: Ae.Func([], [Ae.Opt(zM)], ["query"]),
        icrc3_supported_block_types: Ae.Func([], [Ae.Vec(CM)], ["query"]),
        is_ledger_ready: Ae.Func([], [Ae.Bool], ["query"])
    });
}
    , idlFactory$4 = ({ IDL: Ae }) => {
        const Ue = Ae.Variant({
            RestrictedTo: Ae.Vec(Ae.Principal),
            DepositsRestrictedTo: Ae.Vec(Ae.Principal),
            ReadOnly: Ae.Null,
            GeneralAvailability: Ae.Null
        })
            , Ye = Ae.Record({
                kyt_principal: Ae.Opt(Ae.Principal),
                mode: Ae.Opt(Ue),
                retrieve_btc_min_amount: Ae.Opt(Ae.Nat64),
                max_time_in_queue_nanos: Ae.Opt(Ae.Nat64),
                check_fee: Ae.Opt(Ae.Nat64),
                btc_checker_principal: Ae.Opt(Ae.Principal),
                min_confirmations: Ae.Opt(Ae.Nat32),
                kyt_fee: Ae.Opt(Ae.Nat64)
            })
            , Xe = Ae.Variant({
                Mainnet: Ae.Null,
                Regtest: Ae.Null,
                Testnet: Ae.Null
            })
            , Je = Ae.Record({
                kyt_principal: Ae.Opt(Ae.Principal),
                ecdsa_key_name: Ae.Text,
                mode: Ue,
                retrieve_btc_min_amount: Ae.Nat64,
                ledger_id: Ae.Principal,
                max_time_in_queue_nanos: Ae.Nat64,
                btc_network: Xe,
                check_fee: Ae.Opt(Ae.Nat64),
                btc_checker_principal: Ae.Opt(Ae.Principal),
                min_confirmations: Ae.Opt(Ae.Nat32),
                kyt_fee: Ae.Opt(Ae.Nat64)
            });
        Ae.Variant({
            Upgrade: Ae.Opt(Ye),
            Init: Je
        });
        const sr = Ae.Variant({
            stopped: Ae.Null,
            stopping: Ae.Null,
            running: Ae.Null
        })
            , pr = Ae.Variant({
                controllers: Ae.Null,
                public: Ae.Null
            })
            , gr = Ae.Record({
                freezing_threshold: Ae.Nat,
                controllers: Ae.Vec(Ae.Principal),
                reserved_cycles_limit: Ae.Nat,
                log_visibility: pr,
                wasm_memory_limit: Ae.Nat,
                memory_allocation: Ae.Nat,
                compute_allocation: Ae.Nat
            })
            , Ar = Ae.Record({
                response_payload_bytes_total: Ae.Nat,
                num_instructions_total: Ae.Nat,
                num_calls_total: Ae.Nat,
                request_payload_bytes_total: Ae.Nat
            })
            , qr = Ae.Record({
                status: sr,
                memory_size: Ae.Nat,
                cycles: Ae.Nat,
                settings: gr,
                query_stats: Ar,
                idle_cycles_burned_per_day: Ae.Nat,
                module_hash: Ae.Opt(Ae.Vec(Ae.Nat8)),
                reserved_cycles: Ae.Nat
            })
            , Ao = Ae.Record({
                owner: Ae.Principal,
                subaccount: Ae.Opt(Ae.Vec(Ae.Nat8))
            })
            , pa = Ae.Record({
                height: Ae.Nat32,
                value: Ae.Nat64,
                outpoint: Ae.Record({
                    txid: Ae.Vec(Ae.Nat8),
                    vout: Ae.Nat32
                })
            })
            , ga = Ae.Variant({
                CallFailed: Ae.Null,
                TaintedDestination: Ae.Record({
                    kyt_fee: Ae.Nat64,
                    kyt_provider: Ae.Principal
                })
            })
            , Nl = Ae.Variant({
                ValueTooSmall: Ae.Null,
                Quarantined: Ae.Null
            })
            , $l = Ae.Variant({
                p2wsh_v0: Ae.Vec(Ae.Nat8),
                p2tr_v1: Ae.Vec(Ae.Nat8),
                p2sh: Ae.Vec(Ae.Nat8),
                p2wpkh_v0: Ae.Vec(Ae.Nat8),
                p2pkh: Ae.Vec(Ae.Nat8)
            })
            , Bl = Ae.Variant({
                received_utxos: Ae.Record({
                    to_account: Ao,
                    mint_txid: Ae.Opt(Ae.Nat64),
                    utxos: Ae.Vec(pa)
                }),
                schedule_deposit_reimbursement: Ae.Record({
                    burn_block_index: Ae.Nat64,
                    account: Ao,
                    amount: Ae.Nat64,
                    reason: ga
                }),
                sent_transaction: Ae.Record({
                    fee: Ae.Opt(Ae.Nat64),
                    change_output: Ae.Opt(Ae.Record({
                        value: Ae.Nat64,
                        vout: Ae.Nat32
                    })),
                    txid: Ae.Vec(Ae.Nat8),
                    utxos: Ae.Vec(pa),
                    requests: Ae.Vec(Ae.Nat64),
                    submitted_at: Ae.Nat64
                }),
                distributed_kyt_fee: Ae.Record({
                    block_index: Ae.Nat64,
                    amount: Ae.Nat64,
                    kyt_provider: Ae.Principal
                }),
                init: Je,
                upgrade: Ye,
                retrieve_btc_kyt_failed: Ae.Record({
                    block_index: Ae.Nat64,
                    owner: Ae.Principal,
                    uuid: Ae.Text,
                    address: Ae.Text,
                    amount: Ae.Nat64,
                    kyt_provider: Ae.Principal
                }),
                suspended_utxo: Ae.Record({
                    utxo: pa,
                    account: Ao,
                    reason: Nl
                }),
                accepted_retrieve_btc_request: Ae.Record({
                    received_at: Ae.Nat64,
                    block_index: Ae.Nat64,
                    address: $l,
                    reimbursement_account: Ae.Opt(Ao),
                    amount: Ae.Nat64,
                    kyt_provider: Ae.Opt(Ae.Principal)
                }),
                checked_utxo: Ae.Record({
                    clean: Ae.Bool,
                    utxo: pa,
                    uuid: Ae.Text,
                    kyt_provider: Ae.Opt(Ae.Principal)
                }),
                removed_retrieve_btc_request: Ae.Record({
                    block_index: Ae.Nat64
                }),
                confirmed_transaction: Ae.Record({
                    txid: Ae.Vec(Ae.Nat8)
                }),
                replaced_transaction: Ae.Record({
                    fee: Ae.Nat64,
                    change_output: Ae.Record({
                        value: Ae.Nat64,
                        vout: Ae.Nat32
                    }),
                    old_txid: Ae.Vec(Ae.Nat8),
                    new_txid: Ae.Vec(Ae.Nat8),
                    submitted_at: Ae.Nat64
                }),
                checked_utxo_v2: Ae.Record({
                    utxo: pa,
                    account: Ao
                }),
                ignored_utxo: Ae.Record({
                    utxo: pa
                }),
                reimbursed_failed_deposit: Ae.Record({
                    burn_block_index: Ae.Nat64,
                    mint_block_index: Ae.Nat64
                })
            })
            , Lu = Ae.Record({
                retrieve_btc_min_amount: Ae.Nat64,
                min_confirmations: Ae.Nat32,
                kyt_fee: Ae.Nat64
            })
            , kf = Ae.Record({
                address: Ae.Text,
                amount: Ae.Nat64
            })
            , Hu = Ae.Record({
                block_index: Ae.Nat64
            })
            , Ah = Ae.Variant({
                MalformedAddress: Ae.Text,
                GenericError: Ae.Record({
                    error_message: Ae.Text,
                    error_code: Ae.Nat64
                }),
                TemporarilyUnavailable: Ae.Text,
                AlreadyProcessing: Ae.Null,
                AmountTooLow: Ae.Nat64,
                InsufficientFunds: Ae.Record({
                    balance: Ae.Nat64
                })
            })
            , tM = Ae.Variant({
                Signing: Ae.Null,
                Confirmed: Ae.Record({
                    txid: Ae.Vec(Ae.Nat8)
                }),
                Sending: Ae.Record({
                    txid: Ae.Vec(Ae.Nat8)
                }),
                AmountTooLow: Ae.Null,
                Unknown: Ae.Null,
                Submitted: Ae.Record({
                    txid: Ae.Vec(Ae.Nat8)
                }),
                Pending: Ae.Null
            })
            , nM = Ae.Record({
                account: Ao,
                amount: Ae.Nat64,
                reason: ga
            })
            , oM = Ae.Record({
                account: Ao,
                mint_block_index: Ae.Nat64,
                amount: Ae.Nat64,
                reason: ga
            })
            , fM = Ae.Variant({
                Signing: Ae.Null,
                Confirmed: Ae.Record({
                    txid: Ae.Vec(Ae.Nat8)
                }),
                Sending: Ae.Record({
                    txid: Ae.Vec(Ae.Nat8)
                }),
                AmountTooLow: Ae.Null,
                WillReimburse: nM,
                Unknown: Ae.Null,
                Submitted: Ae.Record({
                    txid: Ae.Vec(Ae.Nat8)
                }),
                Reimbursed: oM,
                Pending: Ae.Null
            })
            , rM = Ae.Record({
                from_subaccount: Ae.Opt(Ae.Vec(Ae.Nat8)),
                address: Ae.Text,
                amount: Ae.Nat64
            })
            , sM = Ae.Variant({
                MalformedAddress: Ae.Text,
                GenericError: Ae.Record({
                    error_message: Ae.Text,
                    error_code: Ae.Nat64
                }),
                TemporarilyUnavailable: Ae.Text,
                InsufficientAllowance: Ae.Record({
                    allowance: Ae.Nat64
                }),
                AlreadyProcessing: Ae.Null,
                AmountTooLow: Ae.Nat64,
                InsufficientFunds: Ae.Record({
                    balance: Ae.Nat64
                })
            })
            , cM = Ae.Variant({
                ValueTooSmall: pa,
                Tainted: pa,
                Minted: Ae.Record({
                    minted_amount: Ae.Nat64,
                    block_index: Ae.Nat64,
                    utxo: pa
                }),
                Checked: pa
            })
            , ju = Ae.Nat64
            , kr = Ae.Record({
                utxo: pa,
                earliest_retry: ju,
                reason: Nl
            })
            , ha = Ae.Record({
                confirmations: Ae.Nat32,
                value: Ae.Nat64,
                outpoint: Ae.Record({
                    txid: Ae.Vec(Ae.Nat8),
                    vout: Ae.Nat32
                })
            })
            , ma = Ae.Variant({
                GenericError: Ae.Record({
                    error_message: Ae.Text,
                    error_code: Ae.Nat64
                }),
                TemporarilyUnavailable: Ae.Text,
                AlreadyProcessing: Ae.Null,
                NoNewUtxos: Ae.Record({
                    suspended_utxos: Ae.Opt(Ae.Vec(kr)),
                    required_confirmations: Ae.Nat32,
                    pending_utxos: Ae.Opt(Ae.Vec(ha)),
                    current_confirmations: Ae.Opt(Ae.Nat32)
                })
            });
        return Ae.Service({
            estimate_withdrawal_fee: Ae.Func([Ae.Record({
                amount: Ae.Opt(Ae.Nat64)
            })], [Ae.Record({
                minter_fee: Ae.Nat64,
                bitcoin_fee: Ae.Nat64
            })], ["query"]),
            get_btc_address: Ae.Func([Ae.Record({
                owner: Ae.Opt(Ae.Principal),
                subaccount: Ae.Opt(Ae.Vec(Ae.Nat8))
            })], [Ae.Text], []),
            get_canister_status: Ae.Func([], [qr], []),
            get_deposit_fee: Ae.Func([], [Ae.Nat64], ["query"]),
            get_events: Ae.Func([Ae.Record({
                start: Ae.Nat64,
                length: Ae.Nat64
            })], [Ae.Vec(Bl)], ["query"]),
            get_known_utxos: Ae.Func([Ae.Record({
                owner: Ae.Opt(Ae.Principal),
                subaccount: Ae.Opt(Ae.Vec(Ae.Nat8))
            })], [Ae.Vec(pa)], ["query"]),
            get_minter_info: Ae.Func([], [Lu], ["query"]),
            get_withdrawal_account: Ae.Func([], [Ao], []),
            retrieve_btc: Ae.Func([kf], [Ae.Variant({
                Ok: Hu,
                Err: Ah
            })], []),
            retrieve_btc_status: Ae.Func([Ae.Record({
                block_index: Ae.Nat64
            })], [tM], ["query"]),
            retrieve_btc_status_v2: Ae.Func([Ae.Record({
                block_index: Ae.Nat64
            })], [fM], ["query"]),
            retrieve_btc_status_v2_by_account: Ae.Func([Ae.Opt(Ao)], [Ae.Vec(Ae.Record({
                block_index: Ae.Nat64,
                status_v2: Ae.Opt(fM)
            }))], ["query"]),
            retrieve_btc_with_approval: Ae.Func([rM], [Ae.Variant({
                Ok: Hu,
                Err: sM
            })], []),
            update_balance: Ae.Func([Ae.Record({
                owner: Ae.Opt(Ae.Principal),
                subaccount: Ae.Opt(Ae.Vec(Ae.Nat8))
            })], [Ae.Variant({
                Ok: Ae.Vec(cM),
                Err: ma
            })], [])
        });
    }
    , idlFactory$3 = ({ IDL: Ae }) => {
        const Ue = Ae.Vec(Ae.Nat8)
            , Ye = Ae.Variant({
                ok: Ae.Nat,
                err: Ae.Text
            })
            , Xe = Ae.Variant({
                ok: Ae.Text,
                err: Ae.Text
            })
            , Je = Ae.Record({
                status: Ae.Text,
                value: Ae.Nat64,
                owner: Ae.Principal,
                completed: Ae.Bool,
                minted: Ae.Bool,
                blockheight: Ae.Nat
            })
            , sr = Ae.Record({
                id: Ae.Opt(Ae.Nat),
                to: Ae.Text,
                fee: Ae.Opt(Ae.Nat),
                notify: Ae.Opt(Ae.Bool),
                other: Ae.Opt(Ae.Vec(Ae.Nat8)),
                memo: Ae.Opt(Ae.Vec(Ae.Nat8)),
                canister: Ae.Text,
                amount: Ae.Nat,
                standard: Ae.Text
            })
            , pr = Ae.Record({
                request: sr,
                user: Ae.Principal,
                binding: Ae.Bool,
                expiry: Ae.Int,
                receiver: Ae.Principal
            })
            , gr = Ae.Variant({
                btc: Ae.Null,
                ckbtc: Ae.Null
            });
        return Ae.Service({
            available_balance_update: Ae.Func([], [Ae.Nat64], []),
            ckbtc_deposit: Ae.Func([Ae.Opt(Ue), Ae.Nat], [Ye], []),
            get_btc_address: Ae.Func([Ae.Text], [Ae.Text], []),
            proxy_canisters: Ae.Func([], [Ae.Vec(Ae.Text)], ["query"]),
            icrc10_supported_standards: Ae.Func([], [Ae.Vec(Ae.Record({
                url: Ae.Text,
                name: Ae.Text
            }))], ["query"]),
            icrc28_trusted_origins: Ae.Func([], [Ae.Record({
                trusted_origins: Ae.Vec(Ae.Text)
            })], ["query"]),
            logs_clear: Ae.Func([], [], []),
            logs_get: Ae.Func([Ae.Nat], [Ae.Vec(Ae.Tuple(Ae.Text, Ae.Text))], ["query"]),
            minter_balance_update: Ae.Func([Ae.Text], [Xe], []),
            minter_broadcast_utxo: Ae.Func([Ae.Text], [Xe], []),
            processed_utxos: Ae.Func([], [Ae.Vec(Ae.Tuple(Ae.Text, Je))], ["query"]),
            utxos_process: Ae.Func([], [Xe], []),
            volt_authorization_notification: Ae.Func([pr, Ae.Opt(Ae.Vec(Ae.Nat8))], [], []),
            withdraw: Ae.Func([Ae.Principal, Ae.Text, Ae.Nat, gr], [Ye], [])
        });
    }
    , idlFactory$2 = ({ IDL: Ae }) => {
        const Ue = Ae.Variant({
            ok: Ae.Null,
            err: Ae.Text
        })
            , Ye = Ae.Text
            , Xe = Ae.Record({
                data: Ae.Opt(Ae.Vec(Ae.Nat8)),
                error: Ae.Opt(Ae.Text),
                success: Ae.Bool
            })
            , Je = Ae.Variant({
                ok: Xe,
                err: Ae.Text
            })
            , sr = Ae.Record({
                id: Ae.Opt(Ae.Nat),
                to: Ae.Text,
                fee: Ae.Opt(Ae.Nat),
                notify: Ae.Opt(Ae.Bool),
                other: Ae.Opt(Ae.Vec(Ae.Nat8)),
                memo: Ae.Opt(Ae.Vec(Ae.Nat8)),
                canister: Ae.Text,
                amount: Ae.Nat,
                standard: Ae.Text
            })
            , pr = Ae.Record({
                request: sr,
                user: Ae.Principal,
                binding: Ae.Bool,
                expiry: Ae.Int,
                receiver: Ae.Principal
            })
            , gr = Ae.Variant({
                ok: pr,
                err: Ae.Text
            })
            , Ar = Ae.Vec(Ae.Nat8)
            , qr = Ae.Record({
                principal: Ae.Text,
                subaccount: Ae.Opt(Ar),
                address: Ye
            })
            , Ao = Ae.Record({
                id: Ae.Opt(Ae.Nat),
                to: Ae.Text,
                fee: Ae.Opt(Ae.Nat),
                notify: Ae.Opt(Ae.Bool),
                other: Ae.Opt(Ae.Vec(Ae.Nat8)),
                memo: Ae.Opt(Ae.Vec(Ae.Nat8)),
                canister: Ae.Text,
                amount: Ae.Nat,
                standard: Ae.Text
            })
            , pa = Ae.Variant({
                ok: Ae.Nat,
                err: Ae.Text
            })
            , ga = Ae.Variant({
                ok: Ae.Tuple(Ae.Nat, Ae.Nat, Ae.Nat),
                err: Ae.Text
            });
        return Ae.Service({
            acceptCycles: Ae.Func([], [], []),
            auth_cancel: Ae.Func([Ae.Nat], [Ue], []),
            auth_capture: Ae.Func([Ae.Nat, Ae.Opt(Ye), Ae.Opt(Ae.Nat), Ae.Opt(Ae.Bool)], [Je], []),
            auth_get: Ae.Func([Ae.Nat], [gr], []),
            availableCycles: Ae.Func([], [Ae.Nat], ["query"]),
            get_address: Ae.Func([Ae.Principal], [Ye], ["query"]),
            get_authorizations: Ae.Func([Ae.Principal], [Ae.Vec(Ae.Tuple(Ae.Nat, pr))], []),
            user_address: Ae.Func([], [Ye], ["query"]),
            user_address_data: Ae.Func([], [qr], ["query"]),
            user_authorizations: Ae.Func([], [Ae.Vec(Ae.Tuple(Ae.Nat, pr))], []),
            user_authorize: Ae.Func([Ao, Ae.Bool, Ae.Principal, Ae.Int, Ae.Opt(Ae.Bool), Ae.Opt(Ae.Vec(Ae.Nat8))], [pa], []),
            user_authorized: Ae.Func([Ae.Text, Ae.Text, Ae.Opt(Ae.Nat)], [Ae.Nat, Ae.Nat], ["query"]),
            user_balance: Ae.Func([Ae.Text, Ae.Text, Ae.Opt(Ae.Nat)], [ga], []),
            user_transfer: Ae.Func([Ao], [Je], [])
        });
    }
    , idlFactory$1 = ({ IDL: Ae }) => {
        const Ue = Ae.Vec(Ae.Nat8)
            , Ye = Ae.Text
            , Xe = Ae.Text
            , Je = Ae.Variant({
                Ok: Xe,
                Err: Ae.Text
            })
            , sr = Ae.Variant({
                Ok: Ue,
                Err: Ae.Text
            })
            , pr = Ae.Vec(Ae.Nat8)
            , gr = pr
            , Ar = Ae.Nat64
            , qr = Ae.Record({
                pubkey: pr,
                targets: Ae.Opt(Ae.Vec(Ae.Principal)),
                expiration: Ar
            })
            , Ao = Ae.Record({
                signature: Ae.Vec(Ae.Nat8),
                delegation: qr
            })
            , pa = Ae.Variant({
                Ok: Ao,
                Err: Ae.Text
            })
            , ga = Ae.Text
            , Nl = Ae.Text
            , $l = Ae.Variant({
                Bip322Simple: Ae.Null,
                ECDSA: Ae.Null
            })
            , Bl = pr
            , Lu = Ae.Record({
                user_canister_pubkey: Bl,
                expiration: Ar
            })
            , kf = Ae.Variant({
                Ok: Lu,
                Err: Ae.Text
            })
            , Hu = Ae.Text
            , Ah = Ae.Variant({
                Ok: Hu,
                Err: Ae.Text
            });
        return Ae.Service({
            get_address: Ae.Func([Ue, Ye], [Je], ["query"]),
            get_caller_address: Ae.Func([Ae.Opt(Ye)], [Je], ["query"]),
            get_principal: Ae.Func([Xe], [sr], ["query"]),
            siwb_get_delegation: Ae.Func([Xe, gr, Ar], [pa], ["query"]),
            siwb_login: Ae.Func([ga, Xe, Nl, gr, $l], [kf], []),
            siwb_prepare_login: Ae.Func([Xe], [Ah], [])
        });
    }, idlFactory = ({ IDL: Ae }) => {
        const Ue = Ae.Text
            , Ye = Ae.Nat
            , Xe = Ae.Int
            , Je = Ae.Variant({
                buy: Ae.Null,
                sell: Ae.Null
            })
            , sr = Ae.Tuple(Ae.Text, Ae.Variant({
                hex: Ae.Text,
                int: Ae.Int,
                nat: Ae.Nat,
                principal: Ae.Principal,
                blob: Ae.Vec(Ae.Nat8),
                bool: Ae.Bool,
                nat8: Ae.Nat8,
                text: Ae.Text
            }))
            , pr = Ae.Vec(sr)
            , gr = Ae.Variant({
                access: Ae.Record({
                    user: Ae.Text
                }),
                token: Ae.Record({
                    tokenid: Ue,
                    deltas: Ae.Vec(Ae.Record({
                        field: Ae.Text,
                        delta: Ae.Variant({
                            add: Ye,
                            sub: Ye,
                            bool: Ae.Bool,
                            text: Ae.Text,
                            amount: Ye
                        })
                    }))
                }),
                trade: Ae.Record({
                    amount_token: Ye,
                    tokenid: Ue,
                    user: Ae.Text,
                    typeof: Je,
                    bonded: Ae.Bool,
                    amount_btc: Ye,
                    price: Ye
                }),
                other: Ae.Record({
                    data: pr,
                    name: Ae.Text
                }),
                mint: Ae.Record({
                    tokenid: Ue,
                    data: pr
                }),
                transaction: Ae.Record({
                    tokenid: Ue,
                    balance: Ye,
                    metadata: pr,
                    user: Ae.Text,
                    typeof: Ae.Variant({
                        add: Ae.Null,
                        sub: Ae.Null
                    }),
                    description: Ae.Text,
                    amount: Ye
                })
            })
            , Ar = Ae.Record({
                time: Xe,
                typeof: gr
            })
            , qr = Ae.Record({
                id: Ae.Nat,
                operation: Ar
            })
            , Ao = Ae.Record({
                btc: Ye,
                token: Ye
            })
            , pa = Ae.Record({
                locked: Ao,
                current: Ao
            })
            , ga = Ae.Record({
                id: Ae.Text,
                ticker: Ae.Text,
                name: Ae.Text
            })
            , Nl = Ae.Record({
                a: Ae.Float64,
                b: Ae.Float64,
                c: Ae.Float64,
                name: Ae.Text
            })
            , $l = Ae.Record({
                creator: Ae.Principal,
                lp_supply: Ye,
                bonded_btc: Ye,
                pool: pa,
                rune: Ae.Opt(ga),
                bonding_threshold_reward: Ye,
                supply: Ye,
                icrc_canister: Ae.Opt(Ae.Principal),
                max_supply: Ye,
                bonding_curve: Ae.Opt(Nl),
                bonding_threshold: Ye,
                bonding_threshold_fee: Ye
            })
            , Bl = Ae.Variant({
                add: Ae.Null,
                remove: Ae.Null
            })
            , Lu = Ae.Record({
                tokenid: Ue,
                typeof: Bl,
                amount: Ye
            })
            , kf = Ae.Variant({
                ok: Ae.Null,
                err: Ae.Text
            })
            , Hu = Ae.Record({
                metadata: pr,
                code: Ae.Opt(Ae.Text),
                prebuy_amount: Ae.Opt(Ye)
            })
            , Ah = Ae.Variant({
                ok: Ae.Null,
                err: Ae.Text
            })
            , tM = Ae.Record({
                slippage: Ae.Opt(Ae.Tuple(Ye, Ae.Nat))
            })
            , nM = Ae.Variant({
                btc: Ye,
                token: Ye
            })
            , oM = Ae.Record({
                tokenid: Ue,
                typeof: Je,
                settings: Ae.Opt(tM),
                amount: nM
            })
            , fM = Ae.Variant({
                ok: Ae.Null,
                err: Ae.Text
            })
            , rM = Ae.Variant({
                btc: Ae.Null,
                ckbtc: Ae.Null,
                volt: Ae.Null
            })
            , sM = Ae.Record({
                protocol: rM,
                tokenid: Ue,
                address: Ae.Text,
                amount: Ye
            })
            , cM = Ae.Variant({
                ok: Ae.Bool,
                err: Ae.Text
            });
        return Ae.Service({
            access_grant: Ae.Func([Ae.Text], [Ae.Bool], []),
            add_fastbtc: Ae.Func([Ae.Principal, Ae.Nat], [], []),
            admin_access_add: Ae.Func([Ae.Vec(Ae.Text), Ae.Text], [], []),
            admin_discount_add: Ae.Func([Ae.Vec(Ae.Text), Ae.Text], [], []),
            getBalance: Ae.Func([Ae.Text, Ue], [Ye], ["query"]),
            getOperation: Ae.Func([Ae.Nat], [Ae.Opt(Ar)], ["query"]),
            getOperations: Ae.Func([Ae.Nat, Ae.Nat], [Ae.Vec(qr)], ["query"]),
            getToken: Ae.Func([Ue], [Ae.Opt($l)], ["query"]),
            icrc10_supported_standards: Ae.Func([], [Ae.Vec(Ae.Record({
                url: Ae.Text,
                name: Ae.Text
            }))], ["query"]),
            icrc28_trusted_origins: Ae.Func([], [Ae.Vec(Ae.Text)], ["query"]),
            test_deposit: Ae.Func([Ue, Ae.Text, Ye], [Ye], []),
            token_liquidity: Ae.Func([Lu], [kf], []),
            token_mint: Ae.Func([Hu], [Ah], []),
            token_trade: Ae.Func([oM], [fM], []),
            token_withdraw: Ae.Func([sM], [cM], []),
            voucher_claim: Ae.Func([Ae.Text], [Ae.Opt(Ye)], [])
        });
    }, he$2 = ({ IDL: je }) => {
        let Ye = je.Vec(je.Nat8)
            , vr = je.Record({
                owner: je.Principal,
                subaccount: je.Opt(Ye)
            })
            , Er = je.Record({
                icrc2: je.Bool
            })
            , Nr = je.Record({
                icrc1_minting_account: je.Opt(vr),
                feature_flags: je.Opt(Er)
            })
            , $r = je.Record({
                e8s: je.Nat64
            })
            , Qr = je.Text
            , qn = je.Record({
                secs: je.Nat64,
                nanos: je.Nat32
            })
            , Lo = je.Record({
                num_blocks_to_archive: je.Nat64,
                max_transactions_per_response: je.Opt(je.Nat64),
                trigger_threshold: je.Nat64,
                more_controller_ids: je.Opt(je.Vec(je.Principal)),
                max_message_size_bytes: je.Opt(je.Nat64),
                cycles_for_archive_creation: je.Opt(je.Nat64),
                node_max_memory_size_bytes: je.Opt(je.Nat64),
                controller_id: je.Principal
            })
            , ra = je.Record({
                send_whitelist: je.Vec(je.Principal),
                token_symbol: je.Opt(je.Text),
                transfer_fee: je.Opt($r),
                minting_account: Qr,
                maximum_number_of_accounts: je.Opt(je.Nat64),
                accounts_overflow_trim_quantity: je.Opt(je.Nat64),
                transaction_window: je.Opt(qn),
                max_message_size_bytes: je.Opt(je.Nat64),
                icrc1_minting_account: je.Opt(vr),
                archive_options: je.Opt(Lo),
                initial_values: je.Vec(je.Tuple(Qr, $r)),
                token_name: je.Opt(je.Text),
                feature_flags: je.Opt(Er)
            });
        je.Variant({
            Upgrade: je.Opt(Nr),
            Init: ra
        });
        let Wa = je.Vec(je.Nat8)
            , Xa = je.Record({
                account: Wa
            })
            , Ml = je.Record({
                account: Qr
            })
            , Ll = je.Record({
                canister_id: je.Principal
            })
            , Hl = je.Record({
                archives: je.Vec(Ll)
            })
            , Gu = je.Nat
            , If = je.Variant({
                Int: je.Int,
                Nat: je.Nat,
                Blob: je.Vec(je.Nat8),
                Text: je.Text
            })
            , Of = je.Nat64
            , Hf = je.Record({
                to: vr,
                fee: je.Opt(Gu),
                memo: je.Opt(je.Vec(je.Nat8)),
                from_subaccount: je.Opt(Ye),
                created_at_time: je.Opt(Of),
                amount: Gu
            })
            , pd = je.Nat
            , Nh = je.Variant({
                GenericError: je.Record({
                    message: je.Text,
                    error_code: je.Nat
                }),
                TemporarilyUnavailable: je.Null,
                BadBurn: je.Record({
                    min_burn_amount: Gu
                }),
                Duplicate: je.Record({
                    duplicate_of: pd
                }),
                BadFee: je.Record({
                    expected_fee: Gu
                }),
                CreatedInFuture: je.Record({
                    ledger_time: je.Nat64
                }),
                TooOld: je.Null,
                InsufficientFunds: je.Record({
                    balance: Gu
                })
            })
            , Up = je.Variant({
                Ok: pd,
                Err: Nh
            })
            , cy = je.Record({
                utc_offset_minutes: je.Opt(je.Int16),
                language: je.Text
            })
            , ly = je.Record({
                metadata: cy,
                device_spec: je.Opt(je.Variant({
                    GenericDisplay: je.Null,
                    LineDisplay: je.Record({
                        characters_per_line: je.Nat16,
                        lines_per_page: je.Nat16
                    })
                }))
            })
            , Bh = je.Record({
                arg: je.Vec(je.Nat8),
                method: je.Text,
                user_preferences: ly
            })
            , ay = je.Variant({
                LineDisplayMessage: je.Record({
                    pages: je.Vec(je.Record({
                        lines: je.Vec(je.Text)
                    }))
                }),
                GenericDisplayMessage: je.Text
            })
            , Xw = je.Record({
                metadata: cy,
                consent_message: ay
            })
            , Mf = je.Record({
                description: je.Text
            })
            , Ho = je.Variant({
                GenericError: je.Record({
                    description: je.Text,
                    error_code: je.Nat
                }),
                InsufficientPayment: Mf,
                UnsupportedCanisterCall: Mf,
                ConsentMessageUnavailable: Mf
            })
            , Ya = je.Variant({
                Ok: Xw,
                Err: Ho
            })
            , Ja = je.Record({
                account: vr,
                spender: vr
            })
            , jl = je.Record({
                allowance: Gu,
                expires_at: je.Opt(Of)
            })
            , Dl = je.Record({
                fee: je.Opt(Gu),
                memo: je.Opt(je.Vec(je.Nat8)),
                from_subaccount: je.Opt(Ye),
                created_at_time: je.Opt(Of),
                amount: Gu,
                expected_allowance: je.Opt(Gu),
                expires_at: je.Opt(Of),
                spender: vr
            })
            , Rf = je.Variant({
                GenericError: je.Record({
                    message: je.Text,
                    error_code: je.Nat
                }),
                TemporarilyUnavailable: je.Null,
                Duplicate: je.Record({
                    duplicate_of: pd
                }),
                BadFee: je.Record({
                    expected_fee: Gu
                }),
                AllowanceChanged: je.Record({
                    current_allowance: Gu
                }),
                CreatedInFuture: je.Record({
                    ledger_time: je.Nat64
                }),
                TooOld: je.Null,
                Expired: je.Record({
                    ledger_time: je.Nat64
                }),
                InsufficientFunds: je.Record({
                    balance: Gu
                })
            })
            , Pf = je.Variant({
                Ok: pd,
                Err: Rf
            })
            , gf = je.Record({
                to: vr,
                fee: je.Opt(Gu),
                spender_subaccount: je.Opt(Ye),
                from: vr,
                memo: je.Opt(je.Vec(je.Nat8)),
                created_at_time: je.Opt(Of),
                amount: Gu
            })
            , Za = je.Variant({
                GenericError: je.Record({
                    message: je.Text,
                    error_code: je.Nat
                }),
                TemporarilyUnavailable: je.Null,
                InsufficientAllowance: je.Record({
                    allowance: Gu
                }),
                BadBurn: je.Record({
                    min_burn_amount: Gu
                }),
                Duplicate: je.Record({
                    duplicate_of: pd
                }),
                BadFee: je.Record({
                    expected_fee: Gu
                }),
                CreatedInFuture: je.Record({
                    ledger_time: Of
                }),
                TooOld: je.Null,
                InsufficientFunds: je.Record({
                    balance: Gu
                })
            })
            , Cf = je.Variant({
                Ok: pd,
                Err: Za
            })
            , $p = je.Nat64
            , q0 = je.Record({
                start: $p,
                length: je.Nat64
            })
            , uy = je.Nat64
            , lM = je.Record({
                timestamp_nanos: je.Nat64
            })
            , pM = je.Variant({
                Approve: je.Record({
                    fee: $r,
                    from: Wa,
                    allowance_e8s: je.Int,
                    allowance: $r,
                    expected_allowance: je.Opt($r),
                    expires_at: je.Opt(lM),
                    spender: Wa
                }),
                Burn: je.Record({
                    from: Wa,
                    amount: $r,
                    spender: je.Opt(Wa)
                }),
                Mint: je.Record({
                    to: Wa,
                    amount: $r
                }),
                Transfer: je.Record({
                    to: Wa,
                    fee: $r,
                    from: Wa,
                    amount: $r,
                    spender: je.Opt(je.Vec(je.Nat8))
                })
            })
            , nM = je.Record({
                memo: uy,
                icrc1_memo: je.Opt(je.Vec(je.Nat8)),
                operation: je.Opt(pM),
                created_at_time: lM
            })
            , sM = je.Record({
                transaction: nM,
                timestamp: lM,
                parent_hash: je.Opt(je.Vec(je.Nat8))
            })
            , aM = je.Record({
                blocks: je.Vec(sM)
            })
            , QT = je.Variant({
                BadFirstBlockIndex: je.Record({
                    requested_index: $p,
                    first_valid_index: $p
                }),
                Other: je.Record({
                    error_message: je.Text,
                    error_code: je.Nat64
                })
            })
            , eM = je.Variant({
                Ok: aM,
                Err: QT
            })
            , JT = je.Func([q0], [eM], [])
            , uM = je.Record({
                callback: JT,
                start: $p,
                length: je.Nat64
            })
            , vM = je.Record({
                certificate: je.Opt(je.Vec(je.Nat8)),
                blocks: je.Vec(sM),
                chain_length: je.Nat64,
                first_block_index: $p,
                archived_blocks: je.Vec(uM)
            })
            , gM = je.Record({
                callback: je.Func([q0], [je.Variant({
                    Ok: je.Vec(je.Vec(je.Nat8)),
                    Err: QT
                })], []),
                start: je.Nat64,
                length: je.Nat64
            })
            , xM = je.Record({
                certificate: je.Opt(je.Vec(je.Nat8)),
                blocks: je.Vec(je.Vec(je.Nat8)),
                chain_length: je.Nat64,
                first_block_index: je.Nat64,
                archived_blocks: je.Vec(gM)
            })
            , RM = je.Record({
                to: Qr,
                fee: $r,
                memo: uy,
                from_subaccount: je.Opt(Ye),
                created_at_time: je.Opt(lM),
                amount: $r
            })
            , mM = je.Record({
                to: Wa,
                fee: $r,
                memo: uy,
                from_subaccount: je.Opt(Ye),
                created_at_time: je.Opt(lM),
                amount: $r
            })
            , dM = je.Variant({
                TxTooOld: je.Record({
                    allowed_window_nanos: je.Nat64
                }),
                BadFee: je.Record({
                    expected_fee: $r
                }),
                TxDuplicate: je.Record({
                    duplicate_of: $p
                }),
                TxCreatedInFuture: je.Null,
                InsufficientFunds: je.Record({
                    balance: $r
                })
            })
            , _M = je.Variant({
                Ok: $p,
                Err: dM
            })
            , EM = je.Record({})
            , AM = je.Record({
                transfer_fee: $r
            });
        return je.Service({
            account_balance: je.Func([Xa], [$r], []),
            account_balance_dfx: je.Func([Ml], [$r], []),
            account_identifier: je.Func([vr], [Wa], []),
            archives: je.Func([], [Hl], []),
            decimals: je.Func([], [je.Record({
                decimals: je.Nat32
            })], []),
            icrc10_supported_standards: je.Func([], [je.Vec(je.Record({
                url: je.Text,
                name: je.Text
            }))], []),
            icrc1_balance_of: je.Func([vr], [Gu], []),
            icrc1_decimals: je.Func([], [je.Nat8], []),
            icrc1_fee: je.Func([], [Gu], []),
            icrc1_metadata: je.Func([], [je.Vec(je.Tuple(je.Text, If))], []),
            icrc1_minting_account: je.Func([], [je.Opt(vr)], []),
            icrc1_name: je.Func([], [je.Text], []),
            icrc1_supported_standards: je.Func([], [je.Vec(je.Record({
                url: je.Text,
                name: je.Text
            }))], []),
            icrc1_symbol: je.Func([], [je.Text], []),
            icrc1_total_supply: je.Func([], [Gu], []),
            icrc1_transfer: je.Func([Hf], [Up], []),
            icrc21_canister_call_consent_message: je.Func([Bh], [Ya], []),
            icrc2_allowance: je.Func([Ja], [jl], []),
            icrc2_approve: je.Func([Dl], [Pf], []),
            icrc2_transfer_from: je.Func([gf], [Cf], []),
            is_ledger_ready: je.Func([], [je.Bool], []),
            name: je.Func([], [je.Record({
                name: je.Text
            })], []),
            query_blocks: je.Func([q0], [vM], []),
            query_encoded_blocks: je.Func([q0], [xM], []),
            send_dfx: je.Func([RM], [$p], []),
            symbol: je.Func([], [je.Record({
                symbol: je.Text
            })], []),
            transfer: je.Func([mM], [_M], []),
            transfer_fee: je.Func([EM], [AM], [])
        });
    }, we$2 = ({ IDL: je }) => {
        let Ye = je.Vec(je.Nat8)
            , vr = je.Record({
                owner: je.Principal,
                subaccount: je.Opt(Ye)
            })
            , Er = je.Record({
                icrc2: je.Bool
            })
            , Nr = je.Record({
                icrc1_minting_account: je.Opt(vr),
                feature_flags: je.Opt(Er)
            })
            , $r = je.Record({
                e8s: je.Nat64
            })
            , Qr = je.Text
            , qn = je.Record({
                secs: je.Nat64,
                nanos: je.Nat32
            })
            , Lo = je.Record({
                num_blocks_to_archive: je.Nat64,
                max_transactions_per_response: je.Opt(je.Nat64),
                trigger_threshold: je.Nat64,
                more_controller_ids: je.Opt(je.Vec(je.Principal)),
                max_message_size_bytes: je.Opt(je.Nat64),
                cycles_for_archive_creation: je.Opt(je.Nat64),
                node_max_memory_size_bytes: je.Opt(je.Nat64),
                controller_id: je.Principal
            })
            , ra = je.Record({
                send_whitelist: je.Vec(je.Principal),
                token_symbol: je.Opt(je.Text),
                transfer_fee: je.Opt($r),
                minting_account: Qr,
                maximum_number_of_accounts: je.Opt(je.Nat64),
                accounts_overflow_trim_quantity: je.Opt(je.Nat64),
                transaction_window: je.Opt(qn),
                max_message_size_bytes: je.Opt(je.Nat64),
                icrc1_minting_account: je.Opt(vr),
                archive_options: je.Opt(Lo),
                initial_values: je.Vec(je.Tuple(Qr, $r)),
                token_name: je.Opt(je.Text),
                feature_flags: je.Opt(Er)
            });
        je.Variant({
            Upgrade: je.Opt(Nr),
            Init: ra
        });
        let Wa = je.Vec(je.Nat8)
            , Xa = je.Record({
                account: Wa
            })
            , Ml = je.Record({
                account: Qr
            })
            , Ll = je.Record({
                canister_id: je.Principal
            })
            , Hl = je.Record({
                archives: je.Vec(Ll)
            })
            , Gu = je.Nat
            , If = je.Variant({
                Int: je.Int,
                Nat: je.Nat,
                Blob: je.Vec(je.Nat8),
                Text: je.Text
            })
            , Of = je.Nat64
            , Hf = je.Record({
                to: vr,
                fee: je.Opt(Gu),
                memo: je.Opt(je.Vec(je.Nat8)),
                from_subaccount: je.Opt(Ye),
                created_at_time: je.Opt(Of),
                amount: Gu
            })
            , pd = je.Nat
            , Nh = je.Variant({
                GenericError: je.Record({
                    message: je.Text,
                    error_code: je.Nat
                }),
                TemporarilyUnavailable: je.Null,
                BadBurn: je.Record({
                    min_burn_amount: Gu
                }),
                Duplicate: je.Record({
                    duplicate_of: pd
                }),
                BadFee: je.Record({
                    expected_fee: Gu
                }),
                CreatedInFuture: je.Record({
                    ledger_time: je.Nat64
                }),
                TooOld: je.Null,
                InsufficientFunds: je.Record({
                    balance: Gu
                })
            })
            , Up = je.Variant({
                Ok: pd,
                Err: Nh
            })
            , cy = je.Record({
                utc_offset_minutes: je.Opt(je.Int16),
                language: je.Text
            })
            , ly = je.Record({
                metadata: cy,
                device_spec: je.Opt(je.Variant({
                    GenericDisplay: je.Null,
                    LineDisplay: je.Record({
                        characters_per_line: je.Nat16,
                        lines_per_page: je.Nat16
                    })
                }))
            })
            , Bh = je.Record({
                arg: je.Vec(je.Nat8),
                method: je.Text,
                user_preferences: ly
            })
            , ay = je.Variant({
                LineDisplayMessage: je.Record({
                    pages: je.Vec(je.Record({
                        lines: je.Vec(je.Text)
                    }))
                }),
                GenericDisplayMessage: je.Text
            })
            , Xw = je.Record({
                metadata: cy,
                consent_message: ay
            })
            , Mf = je.Record({
                description: je.Text
            })
            , Ho = je.Variant({
                GenericError: je.Record({
                    description: je.Text,
                    error_code: je.Nat
                }),
                InsufficientPayment: Mf,
                UnsupportedCanisterCall: Mf,
                ConsentMessageUnavailable: Mf
            })
            , Ya = je.Variant({
                Ok: Xw,
                Err: Ho
            })
            , Ja = je.Record({
                account: vr,
                spender: vr
            })
            , jl = je.Record({
                allowance: Gu,
                expires_at: je.Opt(Of)
            })
            , Dl = je.Record({
                fee: je.Opt(Gu),
                memo: je.Opt(je.Vec(je.Nat8)),
                from_subaccount: je.Opt(Ye),
                created_at_time: je.Opt(Of),
                amount: Gu,
                expected_allowance: je.Opt(Gu),
                expires_at: je.Opt(Of),
                spender: vr
            })
            , Rf = je.Variant({
                GenericError: je.Record({
                    message: je.Text,
                    error_code: je.Nat
                }),
                TemporarilyUnavailable: je.Null,
                Duplicate: je.Record({
                    duplicate_of: pd
                }),
                BadFee: je.Record({
                    expected_fee: Gu
                }),
                AllowanceChanged: je.Record({
                    current_allowance: Gu
                }),
                CreatedInFuture: je.Record({
                    ledger_time: je.Nat64
                }),
                TooOld: je.Null,
                Expired: je.Record({
                    ledger_time: je.Nat64
                }),
                InsufficientFunds: je.Record({
                    balance: Gu
                })
            })
            , Pf = je.Variant({
                Ok: pd,
                Err: Rf
            })
            , gf = je.Record({
                to: vr,
                fee: je.Opt(Gu),
                spender_subaccount: je.Opt(Ye),
                from: vr,
                memo: je.Opt(je.Vec(je.Nat8)),
                created_at_time: je.Opt(Of),
                amount: Gu
            })
            , Za = je.Variant({
                GenericError: je.Record({
                    message: je.Text,
                    error_code: je.Nat
                }),
                TemporarilyUnavailable: je.Null,
                InsufficientAllowance: je.Record({
                    allowance: Gu
                }),
                BadBurn: je.Record({
                    min_burn_amount: Gu
                }),
                Duplicate: je.Record({
                    duplicate_of: pd
                }),
                BadFee: je.Record({
                    expected_fee: Gu
                }),
                CreatedInFuture: je.Record({
                    ledger_time: Of
                }),
                TooOld: je.Null,
                InsufficientFunds: je.Record({
                    balance: Gu
                })
            })
            , Cf = je.Variant({
                Ok: pd,
                Err: Za
            })
            , $p = je.Nat64
            , q0 = je.Record({
                start: $p,
                length: je.Nat64
            })
            , uy = je.Nat64
            , lM = je.Record({
                timestamp_nanos: je.Nat64
            })
            , pM = je.Variant({
                Approve: je.Record({
                    fee: $r,
                    from: Wa,
                    allowance_e8s: je.Int,
                    allowance: $r,
                    expected_allowance: je.Opt($r),
                    expires_at: je.Opt(lM),
                    spender: Wa
                }),
                Burn: je.Record({
                    from: Wa,
                    amount: $r,
                    spender: je.Opt(Wa)
                }),
                Mint: je.Record({
                    to: Wa,
                    amount: $r
                }),
                Transfer: je.Record({
                    to: Wa,
                    fee: $r,
                    from: Wa,
                    amount: $r,
                    spender: je.Opt(je.Vec(je.Nat8))
                })
            })
            , nM = je.Record({
                memo: uy,
                icrc1_memo: je.Opt(je.Vec(je.Nat8)),
                operation: je.Opt(pM),
                created_at_time: lM
            })
            , sM = je.Record({
                transaction: nM,
                timestamp: lM,
                parent_hash: je.Opt(je.Vec(je.Nat8))
            })
            , aM = je.Record({
                blocks: je.Vec(sM)
            })
            , QT = je.Variant({
                BadFirstBlockIndex: je.Record({
                    requested_index: $p,
                    first_valid_index: $p
                }),
                Other: je.Record({
                    error_message: je.Text,
                    error_code: je.Nat64
                })
            })
            , eM = je.Variant({
                Ok: aM,
                Err: QT
            })
            , JT = je.Func([q0], [eM], ["query"])
            , uM = je.Record({
                callback: JT,
                start: $p,
                length: je.Nat64
            })
            , vM = je.Record({
                certificate: je.Opt(je.Vec(je.Nat8)),
                blocks: je.Vec(sM),
                chain_length: je.Nat64,
                first_block_index: $p,
                archived_blocks: je.Vec(uM)
            })
            , gM = je.Record({
                callback: je.Func([q0], [je.Variant({
                    Ok: je.Vec(je.Vec(je.Nat8)),
                    Err: QT
                })], ["query"]),
                start: je.Nat64,
                length: je.Nat64
            })
            , xM = je.Record({
                certificate: je.Opt(je.Vec(je.Nat8)),
                blocks: je.Vec(je.Vec(je.Nat8)),
                chain_length: je.Nat64,
                first_block_index: je.Nat64,
                archived_blocks: je.Vec(gM)
            })
            , RM = je.Record({
                to: Qr,
                fee: $r,
                memo: uy,
                from_subaccount: je.Opt(Ye),
                created_at_time: je.Opt(lM),
                amount: $r
            })
            , mM = je.Record({
                to: Wa,
                fee: $r,
                memo: uy,
                from_subaccount: je.Opt(Ye),
                created_at_time: je.Opt(lM),
                amount: $r
            })
            , dM = je.Variant({
                TxTooOld: je.Record({
                    allowed_window_nanos: je.Nat64
                }),
                BadFee: je.Record({
                    expected_fee: $r
                }),
                TxDuplicate: je.Record({
                    duplicate_of: $p
                }),
                TxCreatedInFuture: je.Null,
                InsufficientFunds: je.Record({
                    balance: $r
                })
            })
            , _M = je.Variant({
                Ok: $p,
                Err: dM
            })
            , EM = je.Record({})
            , AM = je.Record({
                transfer_fee: $r
            });
        return je.Service({
            account_balance: je.Func([Xa], [$r], ["query"]),
            account_balance_dfx: je.Func([Ml], [$r], ["query"]),
            account_identifier: je.Func([vr], [Wa], ["query"]),
            archives: je.Func([], [Hl], ["query"]),
            decimals: je.Func([], [je.Record({
                decimals: je.Nat32
            })], ["query"]),
            icrc10_supported_standards: je.Func([], [je.Vec(je.Record({
                url: je.Text,
                name: je.Text
            }))], ["query"]),
            icrc1_balance_of: je.Func([vr], [Gu], ["query"]),
            icrc1_decimals: je.Func([], [je.Nat8], ["query"]),
            icrc1_fee: je.Func([], [Gu], ["query"]),
            icrc1_metadata: je.Func([], [je.Vec(je.Tuple(je.Text, If))], ["query"]),
            icrc1_minting_account: je.Func([], [je.Opt(vr)], ["query"]),
            icrc1_name: je.Func([], [je.Text], ["query"]),
            icrc1_supported_standards: je.Func([], [je.Vec(je.Record({
                url: je.Text,
                name: je.Text
            }))], ["query"]),
            icrc1_symbol: je.Func([], [je.Text], ["query"]),
            icrc1_total_supply: je.Func([], [Gu], ["query"]),
            icrc1_transfer: je.Func([Hf], [Up], []),
            icrc21_canister_call_consent_message: je.Func([Bh], [Ya], []),
            icrc2_allowance: je.Func([Ja], [jl], ["query"]),
            icrc2_approve: je.Func([Dl], [Pf], []),
            icrc2_transfer_from: je.Func([gf], [Cf], []),
            is_ledger_ready: je.Func([], [je.Bool], ["query"]),
            name: je.Func([], [je.Record({
                name: je.Text
            })], ["query"]),
            query_blocks: je.Func([q0], [vM], ["query"]),
            query_encoded_blocks: je.Func([q0], [xM], ["query"]),
            send_dfx: je.Func([RM], [$p], []),
            symbol: je.Func([], [je.Record({
                symbol: je.Text
            })], ["query"]),
            transfer: je.Func([mM], [_M], []),
            transfer_fee: je.Func([EM], [AM], ["query"])
        });
    };

export {
    idlFactory$5 as canister,
    idlFactory$4 as token,
    idlFactory$3 as btc,
    idlFactory$2 as minter,
    idlFactory$1 as wallet,
    idlFactory,
    he$2 as he2,
    we$2 as we2
};
