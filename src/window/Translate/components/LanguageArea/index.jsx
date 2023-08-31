import { Card, Button, CardFooter, Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { BiTransferAlt } from 'react-icons/bi';
import React, { useEffect } from 'react';
import { atom, useAtom, useAtomValue } from 'jotai';

import { languageList } from '../../../../utils/language';
import { detectLanguageAtom } from '../SourceArea';
import { store } from '../../../../utils/store';

export const sourceLanguageAtom = atom();
export const targetLanguageAtom = atom();

export default function LanguageArea() {
    const [sourceLanguage, setSourceLanguage] = useAtom(sourceLanguageAtom);
    const [targetLanguage, setTargetLanguage] = useAtom(targetLanguageAtom);
    const detectLanguage = useAtomValue(detectLanguageAtom);
    const { t } = useTranslation();
    useEffect(() => {
        store.get('translate_source_language').then((v) => {
            if (v) {
                setSourceLanguage(v);
            } else {
                setSourceLanguage('auto');
            }
        });
        store.get('translate_target_language').then((v) => {
            if (v) {
                setTargetLanguage(v);
            } else {
                setTargetLanguage(zh_cn);
            }
        });
    }, []);

    return (
        <Card
            shadow='none'
            className='bg-content2 h-[35px] rounded-[10px]'
        >
            <CardFooter className='bg-content2 flex justify-between p-0 rounded-[10px]'>
                <div className='flex'>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant='light'>{t(`languages.${sourceLanguage}`)}</Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label='Source Language'
                            className='max-h-[50vh] overflow-y-auto'
                            onAction={(key) => {
                                setSourceLanguage(key);
                            }}
                        >
                            <DropdownItem key='auto'>{t('languages.auto')}</DropdownItem>
                            {languageList.map((x) => {
                                return <DropdownItem key={x}>{t(`languages.${x}`)}</DropdownItem>;
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className='flex'>
                    <Button
                        isIconOnly
                        variant='light'
                        className='text-[20px]'
                        onPress={async () => {
                            if (sourceLanguage !== 'auto') {
                                const oldSourceLanguage = sourceLanguage;
                                setSourceLanguage(targetLanguage);
                                setTargetLanguage(oldSourceLanguage);
                            } else {
                                if (detectLanguage !== '') {
                                    const defaultLanguage = (await store.get('translate_target_language')) ?? 'zh_cn';
                                    if (targetLanguage === defaultLanguage) {
                                        setTargetLanguage(detectLanguage);
                                    } else {
                                        setTargetLanguage(defaultLanguage);
                                    }
                                } else {
                                    const secondLanguage = (await store.get('translate_second_language')) ?? 'en';
                                    const defaultLanguage = (await store.get('translate_target_language')) ?? 'zh_cn';
                                    if (targetLanguage === secondLanguage) {
                                        setTargetLanguage(defaultLanguage);
                                    } else {
                                        setTargetLanguage(secondLanguage);
                                    }
                                }
                            }
                        }}
                    >
                        <BiTransferAlt />
                    </Button>
                </div>
                <div className='flex'>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant='light'>{t(`languages.${targetLanguage}`)}</Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label='Target Language'
                            className='max-h-[50vh] overflow-y-auto'
                            onAction={(key) => {
                                setTargetLanguage(key);
                            }}
                        >
                            {languageList.map((x) => {
                                return <DropdownItem key={x}>{t(`languages.${x}`)}</DropdownItem>;
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </CardFooter>
        </Card>
    );
}
