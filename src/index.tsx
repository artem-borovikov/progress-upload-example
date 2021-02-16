import React from "react";
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import {createUploadLink} from 'apollo-upload-client'
import {ApolloClient, ApolloProvider, gql, InMemoryCache, useMutation} from "@apollo/client";
import {customFetch} from "./custom-fetch";


// смотреть здесь https://github.com/jaydenseric/apollo-upload-client/issues/88
const MUTATION = gql`
    mutation($file: Upload!) {
        fileUpload(file: $file) {
            fileName
        }
    }
`;

function UploadFile() {
    const [mutate] = useMutation(MUTATION);

    function onChange({
                          target: {
                              validity,
                              files: [file],
                          },
                      }: any) {
        if (validity.valid) mutate({
            variables: {file}, context: {
                fetchOptions: {
                    getProgress(progress: number) {
                        console.log(progress)
                    }
                }
            }
        });
    }

    return <input
        type="file"
        required
        //@ts-ignore
        onChange={onChange}
    />;
}

const link = createUploadLink({
    uri: `http://localhost:4001/graphql`,
    //@ts-ignore
    // fetch: buildAxiosFetch(axios, (config, input, init) => ({
    //     ...config,
    //     onUploadProgress: init.onUploadProgress,
    // })),
    fetch: customFetch,
    fetchOptions: {
        onProgress: (progress: number) => {
            console.log(progress);
        },
    },
});


const cache = new InMemoryCache({addTypename: false});
const client = new ApolloClient({
    //@ts-ignore
    link,
    cache
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <UploadFile/>
    </ApolloProvider>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
