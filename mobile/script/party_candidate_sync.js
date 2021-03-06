//
//  usage:
//  $ cd mobile $ node script/party_candidate_sync.js
//  prettier src/data/party_candidates.json manually
//
const fs = require('fs');
const csv2json = require('csvjson-csv2json');

(() => {
    const csv = fs.readFileSync('../data/manual/2020candidate_party.csv', {
        encoding: 'utf8'
    });

    let data = csv2json(csv, { parseNumbers: true });
    data = data.map(toEnvKey);
    data = data.reduce((acc, item) => {
        return {
            ...acc,
            [item.party]: Array.isArray(acc[item.party])
                ? [...acc[item.party], item]
                : [item]
        };
    }, {});

    fs.writeFileSync('src/data/party_candidates.json', JSON.stringify(data));
})();

function toEnvKey(item) {
    return {
        name: item['姓名'],
        photo: item['照片'],
        party: item['政黨'],
        constituency: '不分區',
        rank: item['順位'],
        currentLegislator: item['現任立委'] == 'Y' ? true : false,
        isPast: item['曾任立委（次要）'] == 'Y' ? true : false,
        birth: item['生日'],
        age: item['年齡'],
        wiki: item['wiki'],
        fbPage: item['FB 粉絲專頁'],
        education: item['學歷'],
        educationConnection: item['經歷連結'],
        experience: item['經歷'],
        experienceConnection: item['經歷連結'],
        politics: item['政見'],
        politicsConnection: item['政見連結'],
        others: item['其他'],
        unvarifiedEducation: item['(\b封存) 缺少來源的學歷'],
        unvarifiedPolitics: item['(\b封存) 缺少來源的政見']
    };
}
