/**
 * 2011 Peter 'Pita' Martischka
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
exports.channels = function(operatorFunction)
{
  this.channels = {};
  this.operatorFunction = operatorFunction;
}

exports.channels.prototype.emit = function(channelname, object)
{
  var _this = this;

  //this channel already exists, add it to the queue
  if(_this.channels[channelname])
  {
    _this.channels[channelname].push(object);
  }
  //this channel is new, create it and start it
  else
  {
    _this.channels[channelname] = [object];
    
    _this.operatorFunction(object, function(err)
    {
      if(err) throw err;
      
      //remove the element from the queue
      _this.channels[channelname].shift();
      
      //if there is nothing todo anymore in this channel, clean it up
      if(_this.channels[channelname].length == 0)
      {
        delete _this.channels[channelname];
      }
      //else start the operatorFunction with the next object
      else
      {
        _this.operatorFunction(_this.channels[channelname][0], arguments.callee);
      }
    });
  }
}