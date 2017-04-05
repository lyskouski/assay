
/**
 * Sample testcase
 *
 * @sample - optimal include
 *    var source = require('./{filename}.js');
 *
 * @sample - not recommended (but for some [badly designed] classes the only way)
 *    fs = require('fs');
 *    myCode = fs.readFileSync('{file path}.js','utf-8');
 *    eval(myCode);
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */
var sample = function () {
    return {
        success: true
    };
};

/**
 * Validate condition
 */
it('sample test', function () {
    expect(sample()).toEqual({success: true});
});
