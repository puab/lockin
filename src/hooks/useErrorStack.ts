import { useRef, useState } from 'react';

export default function useErrorStack() {
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    function validate(key: string, cond: boolean, text: string) {
        if (!cond) {
            setErrors(errs => {
                if (!errs[key]) {
                    errs[key] = [text];
                } else {
                    if (!errs[key].includes(text)) {
                        errs[key].push(text);
                    }
                }

                return { ...errs };
            });
        } else {
            setErrors(errs => {
                delete errs[key];

                return { ...errs };
            });
        }

        return cond;
    }

    return { errors, validate };
}
