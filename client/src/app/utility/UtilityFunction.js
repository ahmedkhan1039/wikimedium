export const getSafeRanges = dangerousRange => {
    const commonAncestor = dangerousRange.commonAncestorContainer;

    const s = new Array(0);
    const rs = new Array(0);
    if (dangerousRange.startContainer !== commonAncestor)
        for (let i = dangerousRange.startContainer; i !== commonAncestor; i = i.parentNode)
            s.push(i);


    if (s.length > 0) {
        for (let j = 0; j < s.length; j++) {
            const xs = document.createRange();
            if (j) {
                xs.setStartAfter(s[j - 1]);
                xs.setEndAfter(s[j].lastChild);
            }
            else {
                xs.setStart(s[j], dangerousRange.startOffset);
                xs.setEndAfter(
                    (s[j].nodeType === Node.TEXT_NODE)
                        ? s[j] : s[j].lastChild
                );
            }
            rs.push(xs);
        }
    }

    const e = new Array(0)
    const re = new Array(0);
    if (dangerousRange.endContainer !== commonAncestor)
        for (let k = dangerousRange.endContainer; k !== commonAncestor; k = k.parentNode)
            e.push(k);


    if (e.length > 0) {
        for (let m = 0; m < e.length; m++) {
            const xe = document.createRange();
            if (m) {
                xe.setStartBefore(e[m].firstChild);
                xe.setEndBefore(e[m - 1]);
            }
            else {
                xe.setStartBefore(
                    (e[m].nodeType === Node.TEXT_NODE)
                        ? e[m] : e[m].firstChild
                );
                xe.setEnd(e[m], dangerousRange.endOffset);
            }
            re.unshift(xe);
        }
    }

    const xm = document.createRange();
    if ((s.length > 0) && (e.length > 0)) {
        xm.setStartAfter(s[s.length - 1]);
        xm.setEndBefore(e[e.length - 1]);
    }
    else {
        return [dangerousRange];
    }

    rs.push(xm);

    return rs.concat(re);
}

export const getCurrentScrollPosition = () => {
    return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement
        || document.body.parentNode || document.body).scrollTop;
}

export const positionToolTip = selection => {
    const scrollPosition = getCurrentScrollPosition();
    let selectionRange = null;
    if (selection instanceof HTMLElement) {
        selectionRange = selection.getBoundingClientRect();
    }
    else {
        selectionRange = selection.getRangeAt(0).getBoundingClientRect();
    }

    let top = selectionRange.top - 80;
    let left = ((selectionRange.left + selectionRange.right) / 2) - 60;

    return {
        top: top + scrollPosition + "px",
        left: left + "px",
        opacity: 1
    }
}