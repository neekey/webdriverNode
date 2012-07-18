
        <div class="catalog">
            {{#docs}}
            <ul>
                <li>
                    <p><h3>{{name}}</h3></p>
                    <pre>{{desc}}</pre>
                    <ul>
                        {{#items}}
                        <li>
                            <a href="#item-{{name}}">{{name}}</a>
                        </li>
                        {{/items}}
                    </ul>
                </li>
            </ul>
            {{/docs}}
        </div>
        <hr />
        <div class="documents">
            {{#docs}}
            <ul>
                <li>
                    <p><h3>{{name}}</h3></p>
                    <ul>
                        {{#items}}
                        <li id="item-{{name}}">
                            <p><h4>{{name}}</h4></p>
                            <div class="description">
                            <pre>{{description}}</pre>
                            </div>
                        </li>
                        {{/items}}
                    </ul>
                </li>
            </ul>
            {{/docs}}
        </div>
