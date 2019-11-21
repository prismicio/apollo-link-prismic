import { Observable, ApolloLink, execute } from 'apollo-link';
import fetchMock from 'fetch-mock';
import { PrismicLink } from '../index';
import gql from 'graphql-tag';

const makeCallback = (done, body) => {
  return (...args) => {
    try {
      body(...args);
      done();
    } catch (error) {
      done.fail(error);
    }
  };
};

const makePromise = res =>
      new Promise((resolve, reject) => setTimeout(() => resolve(res)));

const apiData = {"refs":[{"id":"master","ref":"XcGL-REAACYA2Su_","label":"Master","isMasterRef":true}],"bookmarks":{},"types":{"number":"number","post":"post","test":"test","image1":"image1","loop":"loop","timestamp":"timestamp","coco":"coco","jojo":"jojo","image":"image","srenault":"srenault","geo":"geo","slider":"slider","toto":"toto","keytext":"keytext","uiid":"uiid","azerty":"azerty","text":"text","testslice":"testslice","article":"Article","embed":"embed","color":"color","banner":"banner","select":"select","text1":"text1","totoa":"totoA","blog":"Blog post","xxxxxxx":"xxxxxxx","labels":"labels","attemps":"attemps","link":"link","uid":"uid","hehe":"hehe","slices":"slices","qmsldmuqlsd":"qmsldmùqlsd","slicess":"slicess","product1":"product1","tuto":"tuto","group":"group","tutu":"tutu","product":"Product","geopoint":"geopoint"},"languages":[{"id":"en-us","name":"English - United States"},{"id":"es-es","name":"Spanish - Spain (Traditional)"},{"id":"fi","name":"Finnish"},{"id":"ar-bh","name":"Arabic - Bahrain"}],"tags":["jojoéà`","<script>toto</script>","ben&jerry","tagcoco","taghop","tag1234567","tag"],"forms":{"help":{"name":"Help articles","method":"GET","rel":"collection","enctype":"application/x-www-form-urlencoded","action":"https://srenault.cdn.prismic.io/api/v1/documents/search","fields":{"ref":{"type":"String","multiple":false},"q":{"default":"[[:d = at(document.tags, [\"help\"])][:d = any(document.type, [\"article\"])]]","type":"String","multiple":true},"lang":{"type":"String","multiple":false},"page":{"type":"Integer","multiple":false,"default":"1"},"pageSize":{"type":"Integer","multiple":false,"default":"20"},"after":{"type":"String","multiple":false},"fetch":{"type":"String","multiple":false},"fetchLinks":{"type":"String","multiple":false},"orderings":{"type":"String","multiple":false},"referer":{"type":"String","multiple":false}}},"toto":{"name":"toto","method":"GET","rel":"collection","enctype":"application/x-www-form-urlencoded","action":"https://srenault.cdn.prismic.io/api/v1/documents/search","fields":{"ref":{"type":"String","multiple":false},"q":{"default":"[]","type":"String","multiple":true},"lang":{"type":"String","multiple":false},"page":{"type":"Integer","multiple":false,"default":"1"},"pageSize":{"type":"Integer","multiple":false,"default":"20"},"after":{"type":"String","multiple":false},"fetch":{"type":"String","multiple":false},"fetchLinks":{"type":"String","multiple":false},"orderings":{"type":"String","multiple":false},"referer":{"type":"String","multiple":false}}},"aaaa":{"name":"aaaa","method":"GET","rel":"collection","enctype":"application/x-www-form-urlencoded","action":"https://srenault.cdn.prismic.io/api/v1/documents/search","fields":{"ref":{"type":"String","multiple":false},"q":{"default":"[]","type":"String","multiple":true},"lang":{"type":"String","multiple":false},"page":{"type":"Integer","multiple":false,"default":"1"},"pageSize":{"type":"Integer","multiple":false,"default":"20"},"after":{"type":"String","multiple":false},"fetch":{"type":"String","multiple":false},"fetchLinks":{"type":"String","multiple":false},"orderings":{"type":"String","multiple":false},"referer":{"type":"String","multiple":false}}},"hey":{"name":"hey","method":"GET","rel":"collection","enctype":"application/x-www-form-urlencoded","action":"https://srenault.cdn.prismic.io/api/v1/documents/search","fields":{"ref":{"type":"String","multiple":false},"q":{"default":"[]","type":"String","multiple":true},"lang":{"type":"String","multiple":false},"page":{"type":"Integer","multiple":false,"default":"1"},"pageSize":{"type":"Integer","multiple":false,"default":"20"},"after":{"type":"String","multiple":false},"fetch":{"type":"String","multiple":false},"fetchLinks":{"type":"String","multiple":false},"orderings":{"type":"String","multiple":false},"referer":{"type":"String","multiple":false}}},"qmlskdqmsdk":{"name":"qmsldkqsd","method":"GET","rel":"collection","enctype":"application/x-www-form-urlencoded","action":"https://srenault.cdn.prismic.io/api/v1/documents/search","fields":{"ref":{"type":"String","multiple":false},"q":{"default":"[]","type":"String","multiple":true},"lang":{"type":"String","multiple":false},"page":{"type":"Integer","multiple":false,"default":"1"},"pageSize":{"type":"Integer","multiple":false,"default":"20"},"after":{"type":"String","multiple":false},"fetch":{"type":"String","multiple":false},"fetchLinks":{"type":"String","multiple":false},"orderings":{"type":"String","multiple":false},"referer":{"type":"String","multiple":false}}},"qsmdlkqsd":{"name":"qsmlkdqsd","method":"GET","rel":"collection","enctype":"application/x-www-form-urlencoded","action":"https://srenault.cdn.prismic.io/api/v1/documents/search","fields":{"ref":{"type":"String","multiple":false},"q":{"default":"[]","type":"String","multiple":true},"lang":{"type":"String","multiple":false},"page":{"type":"Integer","multiple":false,"default":"1"},"pageSize":{"type":"Integer","multiple":false,"default":"20"},"after":{"type":"String","multiple":false},"fetch":{"type":"String","multiple":false},"fetchLinks":{"type":"String","multiple":false},"orderings":{"type":"String","multiple":false},"referer":{"type":"String","multiple":false}}},"everything":{"method":"GET","enctype":"application/x-www-form-urlencoded","action":"https://srenault.cdn.prismic.io/api/v1/documents/search","fields":{"ref":{"type":"String","multiple":false},"q":{"type":"String","multiple":true},"lang":{"type":"String","multiple":false},"page":{"type":"Integer","multiple":false,"default":"1"},"pageSize":{"type":"Integer","multiple":false,"default":"20"},"after":{"type":"String","multiple":false},"fetch":{"type":"String","multiple":false},"fetchLinks":{"type":"String","multiple":false},"graphQuery":{"type":"String","multiple":false},"orderings":{"type":"String","multiple":false},"referer":{"type":"String","multiple":false}}}},"oauth_initiate":"https://srenault.prismic.io/auth","oauth_token":"https://srenault.prismic.io/auth/token","version":"aa1901d","license":"All Rights Reserved","experiments":{"draft":[],"running":[{"id":"WMK1pioAACkA6AOf","googleId":"GZRjt1AKQMe00KygORk8zg","name":"experiment","variations":[{"id":"WMK1pioAACsA6AOh","ref":"WMK1pioAAOgB6AOi~XcGL-REAACYA2Su_","label":"Base"},{"id":"WMK1uSoAACsA6AP9","ref":"WMK1uSoAABEA6AP-~XcGL-REAACYA2Su_","label":"variationA"}]}]}};

const gqlData = { data: { hello: 'world' } };

describe('PrismicLink', () => {

  const query = gql`
     {
       _allDocuments {
         edges {
           node {
             _meta {
               id
             }
           }
         }
       }
     }`;

  const variables = {};
  const extensions = {};

  beforeEach(() => {
    fetchMock.restore();
    fetchMock
      .get('end:/api', makePromise(apiData))
      .get('*', makePromise(gqlData));
  });

  it('enforces cdn for prismic endpoint', (done) => {

    const link = PrismicLink({
      uri: 'https://test.prismic.io/graphql',
    });

    execute(link, { query, variables, extensions }).subscribe({
      next: makeCallback(done, result => {
        const [uri, options] = fetchMock.lastCall();
        const { method, body, headers } = options;

        expect(body).toBeUndefined();
        expect(method).toBe('GET');
        expect(headers['Prismic-ref'] === apiData.refs[0].ref);
        expect(uri).toBe("https://test.cdn.prismic.io/graphql?query=%7B_allDocuments%7Bedges%7Bnode%7B_meta%7Bid%7D%7D%7D%7D%7D&variables=%7B%7D");
      }),
      error: error => done.fail(error),
    });
  });

  it('do not do anything for non prismic endpoint', (done) => {

    const link = PrismicLink({
      uri: 'https://my.website.com/graphql',
      repositoryName: 'test',
    });

    execute(link, { query, variables, extensions }).subscribe({
      next: makeCallback(done, result => {
        const [uri, options] = fetchMock.lastCall();
        const { method, body, headers } = options;
        expect(body).toBeUndefined();
        expect(method).toBe('GET');
        expect(headers['Prismic-ref'] === apiData.refs[0].ref);
        expect(uri).toBe("https://my.website.com/graphql?query=%7B_allDocuments%7Bedges%7Bnode%7B_meta%7Bid%7D%7D%7D%7D%7D&variables=%7B%7D");
      }),
      error: error => done.fail(error),
    });
  });

  it('throws for non prismic endpoint and missing repositoyName field', (done) => {

    expect(() => {
      PrismicLink({
        uri: 'https://my.website.com/graphql',
      });
    }).toThrow();
  });
});
